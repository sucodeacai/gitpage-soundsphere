"use strict";
//O painel é fixo, no caso os atributos displacingXaxis e displacingYaxis
//servem para saber onde o canvas vai ser inserido. A medida que a tela de amostra
//se move para a direita o canvas precisa ser desenhado mais a esquerda por isso o mesmo é
//negativo e o translate também.
class Painel {
    constructor(daoHome, ctxCanvas, canvas, pageSoundSphereHome, tooltip) {
        this.touchFunctions = new TouchFunctions();
        this.flagDrawMaker = false;
        this.pixelPerSecond = 20;
        this.totalTime = 0;
        this.sizeTrail = 40;
        this.heightPainel = 0;
        this.widthPainel = 0;
        this.lastX = 0;
        this.mouseDown = false;
        this.lastY = 0;
        this.mouseDownX = 0;
        this.lastClassCursor = "";
        this.deltaX = 0;
        this.deltaY = 0;
        this.mouseDownY = 0;
        this.displacingInsertX = 0;
        this.displacingInsertY = 0;
        //Atributo displacingYAxis funciona para controlar/transaladar a posição do canvas
        // + move para ->, - move para <-
        //Mas vale lembrar que o canvas funciona assim:
        // translate 0,0
        // ______________________
        // |    |                |     
        // |____|                | 
        // |                     |
        // |                     |
        // |                     |
        // |_____________________|
        // Translate -5
        // ______________________
        // |    |    |           |     
        // |    |____|           | 
        // |                     |
        // |                     |
        // |                     |
        // |_____________________|
        this.displacingYAxis = 0;
        this.displacingXAxis = 0;
        this.lastMove = undefined;
        //Contra a posição do Marcador/Tracker no painel
        this.xMarker = 0;
        this.lastMakerX = 0;
        this.firstPositionX = 0;
        this.firstPositionY = 0;
        this.moved = false;
        this.DAOHome = daoHome;
        this.tooltip = tooltip;
        //console.log("DAO HOME")
        //console.log(this.DAOHome.listItemBuffer)
        this.pageSoundSphereHome = pageSoundSphereHome;
        this.canvas = canvas;
        this.halfPainelX = (this.canvas.width / 2);
        this.halfPainelY = (this.canvas.height / 2);
        this.ctxCanvas = ctxCanvas;
        this.make();
        this.setSettings();
        this.unselectedAlbumItem();
        this.maxDisplacingXAxis = this.widthPainel - this.canvas.width;
        this.maxDisplacingYAxis = this.heightPainel - this.canvas.height;
    }
    actionMouseDown(event) {
        //console.log("actionMouseDown")
        this.mouseDown = true;
        //console.log(" this.mouseDown ->" + this.move)
        this.mouseDownX = event.offsetX;
        //console.log(" this.mouseDownX ->" + this.mouseDownX)
        this.mouseDownY = event.offsetY;
        //console.log(" this.mouseDownY ->" + this.mouseDownY)
    }
    actionMouseOut(event) {
        //console.log("actionMouseOut")
        this.endMove();
    }
    //O evento ocorre quando o usuário libera um botão do mouse sobre um elemento
    //O movimento do painel só e realizado enquanto se esitver preciosando a tecla
    //ao soltar é desfeita a ação idependente se ele soltar no canvas ou não
    actionMouseUp(event) {
        this.deltaX = 0;
        this.deltaY = 0;
        this.mouseDown = false;
        //console.log("actionMouseUp")
        if (this.pageSoundSphereHome.panelReleased && (!this.pageSoundSphereHome.sequenciador.activePause)) {
            //Se as opções do painel tiverem ativada ele pega o item que esta sobre o mouse e
            //abre o modal
            if (!this.moved && (this.pageSoundSphereHome.itemOptionEnabled)) {
                //console.log("actionMouseUp Não moveu");
                var itemMixTemp = this.getItemMix();
                //console.log("Item Mix TEmpo")
                //console.log(itemMixTemp)
                //console.log("Item Mix TEmpo")
                //console.log("dao Item Mix TEmpo")
                //console.log(this.DAOHome.listItemMixPanel)
                //console.log("dao Item Mix TEmpo")
                if (itemMixTemp) {
                    this.pageSoundSphereHome.itemMixOption = new ItemMixPanel();
                    this.pageSoundSphereHome.itemMixOption.x = itemMixTemp.x;
                    this.pageSoundSphereHome.itemMixOption.y = itemMixTemp.y;
                    this.pageSoundSphereHome.itemMixOption.width = itemMixTemp.width;
                    this.pageSoundSphereHome.itemMixOption.height = itemMixTemp.height;
                    this.pageSoundSphereHome.itemMixOption.startTime = itemMixTemp.startTime;
                    this.pageSoundSphereHome.itemMixOption.endTime = itemMixTemp.endTime;
                    this.pageSoundSphereHome.itemMixOption.color = itemMixTemp.color;
                    this.pageSoundSphereHome.itemMixOption.seconds = itemMixTemp.seconds;
                    this.pageSoundSphereHome.itemMixOption.setVolume(itemMixTemp.getVolume());
                    this.pageSoundSphereHome.itemMixOption.solo = itemMixTemp.solo;
                    this.pageSoundSphereHome.itemMixOption.linha = itemMixTemp.linha;
                    this.pageSoundSphereHome.itemMixOption.setIdSemanticDescriptor(itemMixTemp.getidSemanticDescriptor());
                    this.pageSoundSphereHome.itemMixOption.setCodeSemanticDescriptor(itemMixTemp.getCodeSemanticDescriptor());
                    this.pageSoundSphereHome.itemMixOption.id = itemMixTemp.id;
                    this.pageSoundSphereHome.itemMixOption.idBuffer = itemMixTemp.idBuffer;
                    this.pageSoundSphereHome.showModalOptions();
                }
            }
            else if (!this.moved && this.pageSoundSphereHome.idSelectedIcomAlbum != undefined && (!this.pageSoundSphereHome.itemOptionEnabled)) {
                //console.log("tenta inserir");
                this.insertItemMixPanel(this.pageSoundSphereHome.idSelectedIcomAlbum);
            }
        }
        //123
        if ((!this.moved && this.pageSoundSphereHome.sequenciador.activePause)) {
            //  console.log("SE SEGUNDOS");
            let seconds = this.getSecondsByXPosition(this.getPositionX(event) + this.displacingXAxis);
            if (seconds <= this.totalTime) {
                this.xMarker = this.getPositionX(event) + this.displacingXAxis;
                //  console.log("xMarker set" + this.xMarker);
                this.lastMakerX = this.xMarker;
                this.pageSoundSphereHome.sequenciador.continueFrom = seconds;
                //console.log("OK Voce clicou em " + seconds + " segundos")
                this.reMake();
            }
            else {
                //console.log("Fora - Voce clicou em " + seconds + " segundos")
            }
        }
        this.endMove();
    }
    ;
    //FUnção que gerencia o movimento do painel caso a opção move seja verdadeira
    //de modo que se o usuário estiver clicando e arrastando ele movimenta o painel
    actionMouseMove(e) {
        if (this.pageSoundSphereHome.panelReleased) {
            var evt = e || event;
            //para poder mover o canvas ele tem que ser diferente da posição do click.
            // ta tendo um bug que quando clica ele lança um evento de move e isso contorna
            if ((this.mouseDownX != evt.offsetX) || (this.mouseDownY != evt.offsetY)) {
                if (this.mouseDown) {
                    if (this.moved) {
                        let velocidade = 0.5;
                        const diferenceX = evt.offsetX - this.firstPositionX;
                        if (diferenceX > -5 && diferenceX < 5) {
                            this.deltaX = 0;
                        }
                        else if (diferenceX >= 5 && diferenceX < 100) {
                            this.deltaX = -diferenceX * velocidade;
                        }
                        else if (diferenceX >= 100) {
                            this.deltaX = -100 * velocidade;
                        }
                        else if (diferenceX <= -5 && diferenceX > -100) {
                            this.deltaX = -diferenceX * velocidade;
                        }
                        else if (diferenceX <= -100) {
                            this.deltaX = 100 * velocidade;
                        }
                        const diferenceY = evt.offsetY - this.firstPositionY;
                        if (diferenceY > -5 && diferenceY < 5) {
                            this.deltaY = 0;
                        }
                        else if (diferenceY >= 5 && diferenceY < 100) {
                            this.deltaY = -diferenceY * velocidade;
                        }
                        else if (diferenceY >= 100) {
                            this.deltaY = -100 * velocidade;
                        }
                        else if (diferenceY <= -5 && diferenceY > -100) {
                            this.deltaY = -diferenceY * velocidade;
                        }
                        else if (diferenceY <= -100) {
                            this.deltaY = 100 * velocidade;
                        }
                    }
                    if (!this.moved) {
                        this.firstPositionX = evt.offsetX;
                        this.firstPositionY = evt.offsetY;
                        this.moveAction(e);
                    }
                    console.error("moveu");
                    this.moved = true;
                }
            }
        }
    }
    ;
    removeClassCanvas() {
        $("canvas").removeClass();
        $('canvas').addClass('canvas');
    }
    changeCursorCanvas(e) {
        let el1 = document.getElementById("canvas2");
        //console.log("Delta X: " + this.deltaX + " Delta Y: " + this.deltaY + " Displacing X " + this.displacingXAxis + "Displacing Y " + this.displacingYAxis)
        if (this.displacingXAxis + (-this.deltaX) < 0 && (this.displacingYAxis + (-this.deltaY) < 0)) {
            $('#canvas2').addClass('shadowLeftTop');
        }
        else if (this.displacingXAxis + (-this.deltaX) < 0 && this.displacingYAxis == this.maxDisplacingYAxis) {
            $('#canvas2').addClass('shadowLeftBottom');
        }
        else if (this.displacingXAxis + (-this.deltaX) > this.maxDisplacingXAxis && (this.displacingYAxis + (-this.deltaY) < 0)) {
            $('#canvas2').addClass('shadowRightTop');
        }
        else if (this.displacingXAxis + (-this.deltaX) > this.maxDisplacingXAxis && this.displacingYAxis == this.maxDisplacingYAxis) {
            $('#canvas2').addClass('shadowRightBottom');
        }
        else if (this.displacingXAxis + (-this.deltaX) < 0) {
            $('#canvas2').addClass('shadowLeft');
        }
        else if (this.displacingXAxis + (-this.deltaX) > this.maxDisplacingXAxis) {
            $('#canvas2').addClass('shadowRight');
        }
        else if ((this.displacingYAxis + (-this.deltaY) < 0)) {
            $('#canvas2').addClass('shadowTop');
        }
        else if (this.displacingYAxis == this.maxDisplacingYAxis) {
            $('#canvas2').addClass('shadowBottom');
        }
        //  if( this.displacingXAxis == this.maxDisplacingXAxis ||this.displacingYAxis == this.maxDisplacingYAxis || (this.displacingYAxis + (-this.deltaY) <= 0) ||  (this.displacingXAxis + (-this.deltaX) <= 0)){
        //   e.preventDefault();
        //   $('canvas').addClass("cursorDenied");
        //   console.log("---Bloqueio")
        //   if(!(this.lastClassCursor == "cursorDenied")){
        //     this.removeClassCanvas();
        //     el1!.className += ' cursorDenied';  
        //     this.lastClassCursor = "cursorDenied"
        //   }
        // }else 
        if (this.deltaY >= 5 && this.deltaX == 0) {
            // console.log("---UP")
            if (!(this.lastClassCursor == "cursorUP")) {
                this.removeClassCanvas();
                el1.className += ' cursorUp';
                this.lastClassCursor = "cursorUP";
            }
        }
        else if (this.deltaY <= -5 && this.deltaX == 0) {
            // console.log("---Down")
            if (!(this.lastClassCursor == "cursorDown")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorDown');
                this.lastClassCursor = "cursorDown";
            }
        }
        else if (this.deltaX >= 5 && this.deltaY == 0) {
            //   console.log("---Left")
            if (!(this.lastClassCursor == "cursorLeft")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorLeft');
                this.lastClassCursor = "cursorLeft";
            }
        }
        else if (this.deltaX <= -5 && this.deltaY == 0) {
            //  console.log("---Right")
            $('canvas').addClass('cursorRight');
            if (!(this.lastClassCursor == "cursorRight")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorRight');
                this.lastClassCursor = "cursorRight";
            }
        }
        else if (this.deltaY >= 5 && this.deltaX <= -5) {
            //  console.log("---UP Right")
            if (!(this.lastClassCursor == "cursorUpRight")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorUpRight');
                this.lastClassCursor = "cursorUpRight";
            }
        }
        else if (this.deltaY >= 5 && this.deltaX >= 5) {
            //    console.log("---Up Left")
            if (!(this.lastClassCursor == "cursorUpLeft")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorUpLeft');
                this.lastClassCursor = "cursorUpLeft";
            }
        }
        else if (this.deltaY <= -5 && this.deltaX <= -5) {
            //     console.log("---down left")
            if (!(this.lastClassCursor == "cursorDownLeft")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorDownLeft');
                this.lastClassCursor = "cursorDownLeft";
            }
        }
        else if (this.deltaY <= -5 && this.deltaX >= 5) {
            //  console.log("---down right")
            if (!(this.lastClassCursor == "cursorDownRight")) {
                this.removeClassCanvas();
                $('canvas').addClass('cursorDownRight');
                this.lastClassCursor = "cursorDownRight";
            }
        }
    }
    moveAction(e) {
        //console.log("DELTA Y"+this.deltaY)
        //Verifica a mudança do cursor
        if (this.deltaX != 0 || this.deltaY != 0) {
            this.changeCursorCanvas(e);
        }
        if (this.displacingXAxis >= 0 && this.displacingXAxis <= this.maxDisplacingXAxis) {
            if (this.displacingXAxis + (-this.deltaX) >= this.maxDisplacingXAxis) {
                this.deltaX = -(this.maxDisplacingXAxis - this.displacingXAxis);
                this.displacingXAxis = this.maxDisplacingXAxis;
                this.ctxCanvas.translate(this.deltaX, 0);
            }
            else if (this.displacingXAxis + (-this.deltaX) <= 0) {
                this.deltaX = this.displacingXAxis;
                this.displacingXAxis = 0;
                this.ctxCanvas.translate(this.deltaX, 0);
            }
            else {
                this.displacingXAxis -= this.deltaX;
                this.ctxCanvas.translate(this.deltaX, 0);
            }
        }
        if (this.displacingYAxis >= 0 && this.displacingYAxis <= this.maxDisplacingYAxis) {
            if (this.displacingYAxis + (-this.deltaY) >= this.maxDisplacingYAxis) {
                this.deltaY = -(this.maxDisplacingYAxis - this.displacingYAxis);
                this.displacingYAxis = this.maxDisplacingYAxis;
                this.ctxCanvas.translate(0, this.deltaY);
            }
            else if (this.displacingYAxis + (-this.deltaY) <= 0) {
                this.deltaY = this.displacingYAxis;
                this.displacingYAxis = 0;
                this.ctxCanvas.translate(0, this.deltaY);
            }
            else {
                this.displacingYAxis -= this.deltaY;
                this.ctxCanvas.translate(0, this.deltaY);
            }
        }
        this.reMake();
        if (this.mouseDown) {
            requestAnimationFrame(() => { this.moveAction(e); });
        }
        else {
            this.removeClassCanvas();
            this.lastClassCursor = "";
            console.log("---Default");
            $('canvas').addClass('default');
        }
    }
    // actionMouseMove(e: any) {
    //   if (this.pageSoundSphereHome.panelReleased) {
    //     var evt = e || event;
    //     //para poder mover o canvas ele tem que ser diferente da posição do click.
    //     // ta tendo um bug que quando clica ele lança um evento de move e isso contorna
    //     if ((this.mouseDownX != evt.offsetX) || (this.mouseDownY != evt.offsetY)) {
    //       if (this.move) {
    //         var sizeMoviment = 10;
    //         var deltaX = evt.offsetX - this.lastX;
    //         var deltaY = evt.offsetY - this.lastY;
    //         //normalizaDelta para não ficar se movimentao mto
    //         if (deltaX >= 1) {
    //           deltaX = sizeMoviment;
    //         }
    //         if (deltaX <= -1) {
    //           deltaX = -sizeMoviment;
    //         }
    //         var deltaY = evt.offsetY - this.lastY;
    //         //normalizaDelta para não ficar se movimentao mto
    //         if (deltaY >= 1) {
    //           deltaY = sizeMoviment;
    //         }
    //         if (deltaY <= -1) {
    //           deltaY = -sizeMoviment;
    //         }
    //         this.lastX = evt.offsetX;
    //         this.lastY = evt.offsetY;
    //         let maxDisplacingXAxis = this.widthPainel - this.canvas.width;
    //         let maxDisplacingYAxis = this.heightPainel - this.canvas.height;
    //         if (this.displacingXAxis >= 0 && this.displacingXAxis <= maxDisplacingXAxis) {
    //           if (this.displacingXAxis + (deltaX * -1) > maxDisplacingXAxis) {
    //             this.displacingXAxis = maxDisplacingXAxis;
    //           } else if (this.displacingXAxis + (deltaX * -1) < 0) {
    //             this.displacingXAxis = 0;
    //           } else {
    //            //console.log("Delta X "+deltaX)
    //             this.displacingXAxis -= deltaX;
    //             this.ctxCanvas.translate(deltaX, 0);
    //           }
    //         }
    //         if (this.displacingYAxis >= 0 && this.displacingYAxis <= maxDisplacingYAxis) {
    //           if (this.displacingYAxis + (deltaY * -1) > maxDisplacingYAxis) {
    //             this.displacingYAxis = maxDisplacingYAxis;
    //           } else if (this.displacingYAxis + (deltaY * -1) < 0) {
    //             this.displacingYAxis = 0;
    //           } else {
    //             this.displacingYAxis -= deltaY;
    //             this.ctxCanvas.translate(0, deltaY);
    //           }
    //         }
    //         //console.log("moveu");
    //         this.moved = true;
    //         this.reMake();
    //       }
    //     }
    //   }
    // };
    setSettings() {
        //Touch Event
        // this.canvas.addEventListener("touchstart", (evt: any) => this.actionStartTouchInPanel(evt), false);
        // this.canvas.addEventListener('touchmove', (evt: any) => this.actionMoveTouchInPanel(evt), false);
        // this.canvas.addEventListener("touchend", (evt: any) => this.actionEndNormalTouchInPanel(evt), false);
        // this.canvas.addEventListener("touchleave", (evt: any) => this.actionEndTouchInPanel(evt), false);
        // this.canvas.addEventListener("touchcancel", (evt: any) => this.actionEndTouchInPanel(evt), false);
        //Mouse event
        this.canvas.addEventListener("touchcancel", (evt) => this.actionEndTouchInPanel(evt), false);
        this.canvas.addEventListener("dblclick", (evt) => { evt.preventDefault(); }, false);
        this.canvas.addEventListener("mousedown", (evt) => this.actionMouseDown(evt));
        this.canvas.addEventListener("mouseout", (evt) => this.actionMouseOut(evt));
        this.canvas.addEventListener("mouseup", (evt) => this.actionMouseUp(evt));
        this.canvas.addEventListener("mousemove", (evt) => this.actionMouseMove(evt));
    }
    reMake() {
        //Limpa tela para excluir os rastros
        this.ctxCanvas.clearRect(0, 0, this.widthPainel, this.heightPainel);
        this.drawTrails();
        this.reDrawAllItemMixPanel();
        this.drawGridTime();
        this.drawGridTrail();
        if (this.pageSoundSphereHome.sequenciador.activePlay || this.pageSoundSphereHome.sequenciador.activePause) {
            this.drawMarker();
        }
    }
    ;
    selectedAlbumItem() {
        // console.log("Chamou funcao cursor")
        //  $('canvas').css("cursor", "copy");
    }
    unselectedAlbumItem() {
        // console.log("Chamou funcao cursor")
        // $('canvas').css("cursor", "grab");
    }
    //aofinalizar touch normalmente
    actionEndNormalTouchInPanel(evt) {
        //console.log("tenta inserir");
        //enableScroll();
        if (this.pageSoundSphereHome.panelReleased) {
            if (!this.moved && (this.pageSoundSphereHome.itemOptionEnabled)) {
                var itemMixTemp = this.getItemMix();
                if (itemMixTemp) {
                    this.pageSoundSphereHome.itemMixOption = new ItemMixPanel();
                    this.pageSoundSphereHome.itemMixOption.x = itemMixTemp.x;
                    this.pageSoundSphereHome.itemMixOption.y = itemMixTemp.y;
                    this.pageSoundSphereHome.itemMixOption.startTime = itemMixTemp.startTime;
                    this.pageSoundSphereHome.itemMixOption.endTime = itemMixTemp.endTime;
                    this.pageSoundSphereHome.itemMixOption.seconds = itemMixTemp.seconds;
                    this.pageSoundSphereHome.itemMixOption.setVolume(itemMixTemp.getVolume());
                    this.pageSoundSphereHome.itemMixOption.solo = itemMixTemp.solo;
                    this.pageSoundSphereHome.itemMixOption.setIdSemanticDescriptor(itemMixTemp.getidSemanticDescriptor());
                    this.pageSoundSphereHome.itemMixOption.id = itemMixTemp.id;
                    this.pageSoundSphereHome.itemMixOption.idBuffer = itemMixTemp.idBuffer;
                    this.pageSoundSphereHome.showModalOptions();
                }
            }
            else if (!this.moved && this.pageSoundSphereHome.idSelectedIcomAlbum && (!this.pageSoundSphereHome.itemOptionEnabled)) {
                this.insertItemMixPanel(this.pageSoundSphereHome.idSelectedIcomAlbum);
            }
        }
        this.endMove();
    }
    //Funções para controle do touch no painel
    //enquanto o evento de se mover estiver ativado
    // actionMoveTouchInPanel(e: TouchEvent) {
    //   //console.log("move toush");
    //   if (this.move) {
    //     //console.log("--Painel se movimentando")
    //     let offset = this.touchFunctions.getOffset(this.canvas);
    //     let sizeMoviment = 50;
    //     let moveX = e.touches[0].pageX - offset.left;
    //     let moveY = e.touches[0].pageY - offset.top;
    //     let deltaX;
    //     let deltaY;
    //     if (this.lastX != undefined && this.lastY != undefined) {
    //       deltaX = moveX - this.lastX;
    //       deltaY = moveY - this.lastY;
    //     } else {
    //       deltaX = 0;
    //       deltaY = 0;
    //     }
    //     //normalizaDelta para não ficar se movimentao mto
    //     if (deltaX >= 1) {
    //       deltaX = sizeMoviment;
    //     }
    //     if (deltaX <= -1) {
    //       deltaX = -sizeMoviment;
    //     }
    //     //normalizaDelta para não ficar se movimentao mto
    //     if (deltaY >= 1) {
    //       deltaY = sizeMoviment;
    //     }
    //     if (deltaY <= -1) {
    //       deltaY = -sizeMoviment;
    //     }
    //     this.lastX = moveX;
    //     this.lastY = moveY;
    //     let maxDisplacingXAxis = this.widthPainel - this.canvas.width;
    //     let maxDisplacingYAxis = this.heightPainel - this.canvas.height;
    //     if (this.displacingXAxis >= 0 && this.displacingXAxis <= maxDisplacingXAxis) {
    //       if (this.displacingXAxis + (deltaX * -1) > maxDisplacingXAxis) {
    //         this.displacingXAxis = maxDisplacingXAxis;
    //       } else if (this.displacingXAxis + (deltaX * -1) < 0) {
    //         this.displacingXAxis = 0;
    //       } else {
    //         this.displacingXAxis -= deltaX;
    //         this.ctxCanvas.translate(deltaX, 0);
    //       }
    //     } else { }
    //     if (this.displacingYAxis >= 0 && this.displacingYAxis <= maxDisplacingYAxis) {
    //       if (this.displacingYAxis + (deltaY * -1) > maxDisplacingYAxis) {
    //         this.displacingYAxis = maxDisplacingYAxis;
    //       } else if (this.displacingYAxis + (deltaY * -1) < 0) {
    //         this.displacingYAxis = 0;
    //       } else {
    //         this.displacingYAxis -= deltaY;
    //         this.ctxCanvas.translate(0, deltaY);
    //       }
    //     } else {
    //       //console.log("actionMoveTouchInPanel não moveu")
    //     }
    //     //console.log("teste movimendo");
    //     this.moved = true;
    //     this.reMake();
    //   }
    // // }
    // private actionStartTouchInPanel(evt: any) {
    //   //console.log("Iniciou o touch")
    //   if (this.pageSoundSphereHome.panelReleased) {
    //     if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
    //       evt.preventDefault();
    //       //console.log("é android");
    //       //console.log("lastMovov: " + event);
    //       this.lastMove = event;
    //     }
    //     this.mouseDown = true;
    //   }
    // }
    //FUnção para desenhar/criar o painel
    make() {
        this.setTimePanel(60);
        this.setTrailPanel(80);
        this.reDrawAllItemMixPanel();
        this.drawTrails();
        this.drawGridTime();
        this.drawGridTrail();
    }
    ;
    //COnfigura o comprimento do painel de mixagem de acordo com o tempo em
    //minutos informado 
    setTimePanel(minutos) {
        var seconds = minutos * 60;
        this.widthPainel = this.pixelPerSecond * seconds;
    }
    ;
    //Alterar o numero de trilhas para mixagem
    setTrailPanel(val) {
        this.heightPainel = val * this.sizeTrail;
        // var i;
        // for (i = 0; i < val; i = i + 1) {
        //   this.DAOHome.listItemMixPanel[i] = [];
        // }
    }
    ;
    //Função para atualizar a array de acordo com o numero de trilhas
    reDrawAllItemMixPanel() {
        var i, j;
        for (i = 0; i < this.getQtdTrails(); i = i + 1) {
            if (this.DAOHome.listItemMixPanel[i] != null) {
                for (j = 0; j < this.DAOHome.listItemMixPanel[i].length; j = j + 1) {
                    if (!this.DAOHome.listItemMixPanel[i][j].excluded) {
                        this.DAOHome.listItemMixPanel[i][j].draw(this);
                    }
                }
            }
        }
    }
    ;
    //Retorna a quantidade de trilhas que o painel possui
    getQtdTrails() {
        return this.heightPainel / this.sizeTrail;
    }
    ;
    //Desenha as linhas que divide as trilhas
    drawTrails() {
        var x = this.sizeTrail - 0.5;
        // this.ctxCanvas.beginPath();
        // this.ctxCanvas.fillStyle = '#FFFFFF';
        // //Converte os segundos no tamanho a ser inserido
        // this.ctxCanvas.fillRect(0, 0, this.widthPainel, this.heightPainel);
        for (x; x < this.heightPainel; x += this.sizeTrail) {
            this.ctxCanvas.beginPath();
            this.ctxCanvas.lineWidth = 2;
            this.ctxCanvas.strokeStyle = "#000";
            this.ctxCanvas.moveTo(0, x);
            this.ctxCanvas.lineTo(this.widthPainel, x);
            this.ctxCanvas.stroke();
        }
    }
    ;
    //Desenha as linha das trilhas
    drawGridTime() {
        var x = this.pixelPerSecond + 0.5;
        var y = 0;
        this.ctxCanvas.beginPath();
        this.ctxCanvas.lineWidth = 1;
        this.ctxCanvas.strokeStyle = "red";
        for (x; x <= this.widthPainel; x += this.pixelPerSecond) {
            var xcoodenate = x;
            var time = this.getTimeGrid(x);
            var timeString = String(time);
            var timeLenght = timeString.length;
            if ((y % 2) == 0) {
                this.ctxCanvas.moveTo(xcoodenate, 0 + this.displacingYAxis);
                this.ctxCanvas.lineTo(xcoodenate, 8 + this.displacingYAxis);
                this.ctxCanvas.fillStyle = '#000';
                this.ctxCanvas.fillText(time, (x - 3 * timeLenght), (17 + this.displacingYAxis));
            }
            else {
                this.ctxCanvas.moveTo(xcoodenate, 0 + this.displacingYAxis);
                this.ctxCanvas.lineTo(xcoodenate, 4 + this.displacingYAxis);
            }
            y = y + 1;
        }
        this.ctxCanvas.strokeStyle = "#000";
        this.ctxCanvas.stroke();
        this.ctxCanvas.closePath();
    }
    //Get Time para ser usado na grid
    getTimeGrid(y) {
        var time = '';
        var segundos = y / this.pixelPerSecond;
        var segundo = segundos % 60;
        var minutos = segundos / 60;
        var minuto = minutos % 60;
        var hora = minutos / 60;
        // if (Math.floor(segundos) <= 0) {
        //   time = '00' + time;
        // }
        if (Math.floor(segundos) > 0) {
            time = Math.floor(segundo).toString().length == 1 ? '0' + Math.floor(segundo).toString() : Math.floor(segundo).toString();
        }
        if (Math.floor(minutos) > 0) {
            time = Math.floor(minuto) + ':' + time;
        }
        if (Math.floor(hora) > 0) {
            time = Math.floor(hora) + ':' + time;
        }
        return time;
    }
    drawGridTrail() {
        var y = (this.sizeTrail / 2);
        for (y; y <= this.heightPainel; y += this.sizeTrail) {
            var trail = this.getNumberTrailByHeight(y);
            this.ctxCanvas.fillStyle = 'black';
            this.ctxCanvas.fillText(trail, (1 + this.displacingXAxis), y);
        }
        this.ctxCanvas.stroke();
    }
    ;
    //Retorna em que trilha foi inserido o som de acordo com
    //height informado
    getNumberTrailByHeight(val) {
        var x = this.sizeTrail, trail = 1;
        for (x; x <= this.heightPainel; x += this.sizeTrail) {
            if (val <= x) {
                break;
            }
            trail += 1;
        }
        return trail;
    }
    ;
    //Atraves da ultima posição do cursor ele joga para a função que o chamou
    //o itemMix daquela posição
    getItemMix() {
        //console.log("getItem Mix")
        //console.log(event)
        //console.log("getItem");
        var remove = new ItemMixPanel();
        remove.width = (this.pixelPerSecond);
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
            remove.x = this.getPositionX(this.lastMove) + this.displacingXAxis;
            remove.y = this.getMiddleHeigtTrail(this.getPositionY(this.lastMove) + this.displacingYAxis);
        }
        else {
            //console.log(event)
            remove.x = this.getPositionX(event) + this.displacingXAxis;
            remove.y = this.getMiddleHeigtTrail(this.getPositionY(event) + this.displacingYAxis);
        }
        var listaRemove = this.checkItemMixPanel(remove);
        if (listaRemove.length >= 1) {
            //console.log("Retornando o primeiro item da lista encontrado")
            return listaRemove[0];
        }
        else {
            //console.log("Retornando false pq nao encontrou nehum item")
            return false;
        }
    }
    //Retorna o endereço que a o som deve ser inserido no Eixo y
    //para ser desenhaado de acordo com o height informado
    getMiddleHeigtTrail(val) {
        return (this.getNumberTrailByHeight(val) * this.sizeTrail) - (this.sizeTrail / 2);
    }
    ;
    //Retorna a lista de itemMixPanels com que o itemMixPanelenviado se colide
    checkItemMixPanel(itemMixPanel) {
        let listColisao = [], numeroTrilha = this.getNumberTrailByHeight(itemMixPanel.y);
        let listProvisoria = (this.DAOHome.listItemMixPanel[numeroTrilha - 1]) ? this.DAOHome.listItemMixPanel[numeroTrilha - 1] : [];
        let i;
        for (i = 0; i < listProvisoria.length; i = i + 1) {
            //Se o item não tiver sido excluido então ele deve ser checado
            //se tem colisoes ou nao
            if (!listProvisoria[i].excluded) {
                if (this.checkCollision(itemMixPanel.getColisao(), listProvisoria[i].getColisao())) {
                    listColisao.push(listProvisoria[i]);
                }
            }
        }
        return listColisao;
    }
    //Verifica se a colisões
    checkCollision(ret1, ret2) {
        return (ret1.x + ret1.width) > ret2.x &&
            ret1.x < (ret2.x + ret2.width) &&
            (ret1.y + ret1.height) > ret2.y &&
            ret1.y < (ret2.y + ret2.height);
    }
    changeToValidItem(itemMixPanel) {
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        let newLinha = linha;
        let teveColisao = false;
        let podeInserir = false;
        this.displacingInsertY = 0;
        let continua = true;
        do {
            teveColisao = false;
            //percorre toda a lista de de itens da newLinha
            //console.log("Indicou o do")
            if (this.DAOHome.listItemMixPanel[newLinha] != undefined) {
                //console.log("Verificando lista != UNDEFINID")
                for (let index = 0; index < this.DAOHome.listItemMixPanel[newLinha].length; index++) {
                    //Se for diferente do item que estamos tentando inserir
                    //E o item a ser comparado não estiver excluido
                    if (this.DAOHome.listItemMixPanel[newLinha][index].id != itemMixPanel.id && (!this.DAOHome.listItemMixPanel[newLinha][index].excluded)) {
                        //Se teve colisao
                        if (this.checkCollision(this.DAOHome.listItemMixPanel[newLinha][index].getColisao(), itemMixPanel.getColisao())) {
                            teveColisao = true;
                            newLinha = newLinha + 1;
                            itemMixPanel.y = itemMixPanel.y + this.sizeTrail;
                            this.displacingInsertY += 40;
                            //console.log(" colidiu")
                            break;
                        }
                    }
                }
            }
            else {
                //console.log("Lista undefinde")
                teveColisao = false;
            }
            //Se não teve colisao entao pode inserir  
            if (!teveColisao) {
                continua = false;
            }
        } while (continua);
        let mensagem = "Atenção! </br> ";
        if (this.getNumberTrailByHeight(itemMixPanel.y) > this.getQtdTrails()) {
            mensagem += "Modificação não realizada pois o item passaria do número máximo de trilhas.</br> ";
        }
        if ((itemMixPanel.x < 0 || (itemMixPanel.x + itemMixPanel.width) > this.widthPainel)) {
            mensagem += "Modificação não realizada pois o item teria um tempo invalído na mixagem.</br>";
        }
        if (this.getNumberTrailByHeight(itemMixPanel.y) <= this.getQtdTrails() && (itemMixPanel.x >= 0 && (itemMixPanel.x + itemMixPanel.width) <= this.widthPainel)) {
            return true;
        }
        else {
            this.tooltip.showMessage(mensagem);
            return false;
        }
    }
    //Função que tentar inserir desenhar/inserir o item no Painel
    //caso não seja possivel ela da uma mensagem informando o usuario
    insertItemMixPanel(idSoundIconSelect) {
        //console.log("getQtdTrails" + this.getQtdTrails());
        let idBuffer = idSoundIconSelect;
        let itemMixPanel = new ItemMixPanel();
        itemMixPanel.seconds = this.DAOHome.listItemBuffer[idBuffer].timeDuration;
        itemMixPanel.color = this.DAOHome.listItemBuffer[idBuffer].color;
        itemMixPanel.idBuffer = idBuffer;
        itemMixPanel.width = (itemMixPanel.seconds * this.pixelPerSecond);
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
            itemMixPanel.x = this.getPositionX(this.lastMove) + this.displacingXAxis;
            itemMixPanel.y = this.getMiddleHeigtTrail(this.getPositionY(this.lastMove) + this.displacingYAxis);
        }
        else {
            itemMixPanel.x = this.getPositionX(event) + this.displacingXAxis;
            itemMixPanel.y = this.getMiddleHeigtTrail(this.getPositionY(event) + this.displacingYAxis);
        }
        console.log(this.lastX);
        console.log(this.lastY);
        let listColisoes = this.checkItemMixPanel(itemMixPanel);
        //Se ele colidir apenas com um ele joga para o lado
        //Se não houver nova colisão ele altera o itemMixPanel
        //e joga ele ao terminio do que ele colidiu
        //se houver alguma colisão mesmo depois de mover ele adota o comportamento padrão
        //que é jogar para baixo 
        if (this.lastX != itemMixPanel.x || this.lastY != itemMixPanel.y) {
            console.log("~E diferente: " + listColisoes.length);
            if (listColisoes.length === 1) {
                console.log("~tem colisao");
                if (itemMixPanel.x >= listColisoes[0].x && itemMixPanel.x <= listColisoes[0].x + listColisoes[0].width) {
                    let newItem = new ItemMixPanel();
                    newItem.x = listColisoes[0].x + listColisoes[0].width;
                    newItem.width = (itemMixPanel.seconds * this.pixelPerSecond);
                    newItem.y = itemMixPanel.y;
                    let colisoes2 = this.checkItemMixPanel(newItem);
                    if (colisoes2.length === 0) {
                        itemMixPanel.x = listColisoes[0].x + listColisoes[0].width;
                    }
                }
            }
        }
        this.lastX = itemMixPanel.x;
        this.lastY = itemMixPanel.y;
        if (this.changeToValidItem(itemMixPanel)) {
            itemMixPanel.draw(this);
            itemMixPanel.startTime = this.getSecondsByXPosition(itemMixPanel.x);
            itemMixPanel.endTime = itemMixPanel.startTime + itemMixPanel.seconds;
            itemMixPanel.id = this.DAOHome.getNewIdItemMix();
            this.pageSoundSphereHome.sequenciador.needGenerateBuffer = true;
            var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
            itemMixPanel.linha = linha;
            this.DAOHome.pushItemMixPanel(itemMixPanel);
            if (this.displacingInsertY > 0) {
                this.ctxCanvas.translate(0, -this.displacingInsertY);
                this.displacingYAxis += this.displacingInsertY;
                //Se moveu ele move o ultimo X e Y tbm para nao acontecer de ele tentar joogar
                //para o lado
                this.lastY += this.displacingInsertY;
                this.reMake();
            }
        }
    }
    //get quantidade de segundos de acordo com  X
    getSecondsByXPosition(xCoordate) {
        var seconds = xCoordate / this.pixelPerSecond;
        return seconds;
    }
    ;
    //Adiciona itemMixPanel
    // pushItemMixPanel(itemMixPanel: ItemMixPanel) {
    //   var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
    //   //console.log("this.DAOHome.listItemMixPanel[linha].push(itemMixPanel)")
    //   //console.log(this.DAOHome.listItemMixPanel)
    //   itemMixPanel.linha = linha;
    //   this.DAOHome.pushItemMixPanel(itemMixPanel);
    //   // if (this.DAOHome.listItemMixPanel[linha] == undefined) {
    //   //   this.DAOHome.listItemMixPanel[linha] = new Array();
    //   //   this.DAOHome.listItemMixPanel[linha].push(itemMixPanel);
    //   // } else {
    //   //   this.DAOHome.listItemMixPanel[linha].push(itemMixPanel);
    //   // }
    // };
    updateItemMixPanel(itemMixPanel) {
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        itemMixPanel.x = this.getXbySeconds(itemMixPanel.startTime);
        // let newLinha = linha;
        // let podeInserir = false;
        // let teveColisao = false;
        // do {
        //   teveColisao = false;
        //   //percorre toda a lista de de itens da newLinha
        //   //console.log("Indicou o do")
        //   if (this.DAOHome.listItemMixPanel[newLinha] != undefined) {
        //     //console.log("Verificando lista != UNDEFINID")
        //     for (let index = 0; index < this.DAOHome.listItemMixPanel[newLinha].length; index++) {
        //       //Se for diferente do item que estamos tentando inserir
        //       //E o item a ser comparado não estiver excluido
        //       if (this.DAOHome.listItemMixPanel[newLinha][index].id != itemMixPanel.id && (!this.DAOHome.listItemMixPanel[newLinha][index].excluded)) {
        //         //Se teve colisao
        //         if (this.checkCollision(this.DAOHome.listItemMixPanel[newLinha][index].getColisao(), itemMixPanel.getColisao())) {
        //           teveColisao = true;
        //           newLinha = newLinha + 1;
        //           itemMixPanel.y = itemMixPanel.y + this.sizeTrail;
        //           //console.log(" colidiu")
        //           break;
        //         }
        //       }
        //     }
        //   } else {
        //     //console.log("Lista undefinde")
        //     teveColisao = false;
        //   }
        //   //Se não teve colisao entao pode inserir  
        //   if (!teveColisao) {
        //     podeInserir = true;
        //   }
        // } while (!podeInserir);
        if (this.changeToValidItem(itemMixPanel)) {
            console.log("Item valido");
            if (this.DAOHome.updateItemMixPane(itemMixPanel, linha, this.getNumberTrailByHeight(itemMixPanel.y) - 1, this.sizeTrail)) {
                this.pageSoundSphereHome.sequenciador.needGenerateBuffer = true;
                this.reMake();
                // console.log("------------------------TEVE ALTERAÇÂO")
            }
            else {
                // console.log("------------------------N TEVE ALTERAÇÂO")
            }
        }
        //Gerar novamente o Item Buffer
    }
    deleteItemMixPanel(itemMixPanel) {
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        this.DAOHome.deleteItemMixPanel(itemMixPanel, linha);
        this.pageSoundSphereHome.sequenciador.needGenerateBuffer = true;
        this.reMake();
    }
    //função para controlar o movimento no eixo x de acordo com a movimentaçãp do mouse
    endMove() {
        this.mouseDown = false;
        this.moved = false;
        // this.lastX = 0;
        // this.lastY = 0;
        this.firstPositionX = 0;
        this.firstPositionY = 0;
    }
    //Ao cancelar/encerrar touch
    actionEndTouchInPanel(evt) {
        //enableScroll();
        //console.log("end touch 1");
        this.endMove();
    }
    getPositionX(event) {
        var x;
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
            var offset = this.touchFunctions.getOffset(this.canvas);
            x = event.touches[0].pageX - offset.left;
        }
        else {
            x = (event.offsetX !== undefined) ? event.offsetX : (event.layerX - event.target.offsetLeft);
        }
        return x;
    }
    //Posição do mouse no eixo Y
    getPositionY(event) {
        var y;
        //Metodo funciona apenas no chrome
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
            var offset = this.touchFunctions.getOffset(this.canvas);
            y = event.touches[0].pageY - offset.top;
        }
        else {
            y = (event.offsetY !== undefined) ? event.offsetY : (event.layerY - event.target.offsetTop);
        }
        return y;
    }
    // função par controlar o movimento do marker caso passe da metade do canvas
    moveDisplacingXMarker(currentMarkerX) {
        //Condição para passar da metade
        //console.log("ENTROU NO xmarker")
        if (currentMarkerX > this.halfPainelX + this.displacingXAxis) {
            // console.log("ENTROU NO IF")
            let deltaX = currentMarkerX - this.lastMakerX;
            //if para verificar se o movimento do quadrante xDisplacingXaxis
            //é maior devido a mudança do marker no pause.
            //console.log("Delta x: "+deltaX)
            //console.log("Movendo normal")
            if (this.displacingXAxis >= 0 && this.displacingXAxis <= this.maxDisplacingXAxis) {
                // console.log("ENTROU NO IF 2")
                if (this.displacingXAxis + (deltaX) < this.maxDisplacingXAxis) {
                    // console.log("ENTROU NO IF3")
                    //console.log("Move Displacing")
                    //console.log(this.displacingXAxis)
                    this.displacingXAxis += deltaX;
                    this.ctxCanvas.translate(-deltaX, 0);
                }
            }
            //this.reMake();
        }
        this.lastMakerX = currentMarkerX;
    }
    ;
    drawMarker() {
        this.ctxCanvas.beginPath();
        this.ctxCanvas.moveTo((this.xMarker), 0);
        this.ctxCanvas.lineTo((this.xMarker), this.heightPainel);
        this.ctxCanvas.strokeStyle = "#000";
        this.ctxCanvas.stroke();
    }
    animationPlayPanel() {
        if (this.flagDrawMaker) {
            let agora = new Date().getTime();
            let decorrido = agora - this.anterior;
            this.moveDisplacingXMarker(this.xMarker);
            this.reMake();
            const velocidade = this.pixelPerSecond;
            this.xMarker += velocidade * decorrido / 1000;
            this.anterior = agora;
            if (this.getSecondsByXPosition(this.xMarker) <= (this.totalTime)) {
                requestAnimationFrame(() => { this.animationPlayPanel(); });
            }
            else {
                this.resetTranslate();
                this.reMake();
            }
        }
    }
    ;
    drawStoppedMarker(totalTime) {
        this.totalTime = totalTime;
        let xPositionBySeconds = this.getXbySeconds(totalTime);
        //console.log("xxxxxxxxxxxxxxxxxxxx xPositionBySeconds " + xPositionBySeconds)
        //O painel foi movido apenas até o tempo maximo (O tempo maximo aparece no painel)
        if (this.displacingXAxis < xPositionBySeconds) {
            //console.log("===================O painel foi movido apenas até o tempo maximo")
            //console.log("===================this.displacingXAxis  " + this.displacingXAxis)
            this.xMarker = this.displacingXAxis + 0.5;
            this.lastMakerX = this.displacingXAxis + 0.5;
            //A mixagem não aparece no painel
        }
        else {
            //Menor ou igual a metade do painel que a metade do painel
            if (xPositionBySeconds <= this.halfPainelX) {
                //console.log("===================Menor que a metade do painel")
                //  console.log("===================this.displacingXAxis  " + this.displacingXAxis)
                this.resetTranslateX();
                this.xMarker = this.displacingXAxis + 0.5;
                this.lastMakerX = this.displacingXAxis + 0.5;
                this.ajustDisplacing();
            }
            else {
                //  console.log("===================Maior que a metade do painel")
                //console.log("===================this.displacingXAxis  " + this.displacingXAxis)
                const newXmarker = xPositionBySeconds - this.getXbySeconds(1);
                this.resetTranslateX();
                this.xMarker = newXmarker;
                this.lastMakerX = newXmarker;
                this.ajustDisplacing();
            }
            // this.ctxCanvas.translate(-(xPositionBySeconds), 0);
            // this.displacingXAxis =xPositionBySeconds;
            // this.xMarker = xPositionBySeconds;
            // this.lastMakerX = xPositionBySeconds;
        }
        let seconds = this.getSecondsByXPosition(this.xMarker);
        this.pageSoundSphereHome.sequenciador.continueFrom = seconds;
        this.anterior = new Date().getTime();
        this.reMake();
    }
    startLoopMarker(totalTime) {
        "use strict";
        //console.log("Inciando: tempo total: " + totalTime)
        this.totalTime = totalTime;
        this.xMarker = 0;
        this.lastMakerX = 0;
        this.anterior = new Date().getTime();
        this.flagDrawMaker = true;
        this.resetTranslate();
        this.animationPlayPanel();
    }
    ;
    continueLoopMarker() {
        "use strict";
        this.anterior = new Date().getTime();
        this.flagDrawMaker = true;
        this.ajustDisplacing();
        //console.log("xxxxxxxxxxxxxxxxxxCONTINUE")
        this.animationPlayPanel();
    }
    ;
    //Ajusta a translocação do painel
    ajustDisplacing() {
        //Se o Traker (this.xMarker) estiver depois da metade do painel e a translocação (this.displacingXAxis) fizer com que o traker fica centralizado na metade do painel
        //ele transloca e deixa o traker no meio do painel
        if (this.xMarker > this.halfPainelX && this.displacingXAxis < this.xMarker - this.halfPainelX) {
            this.resetTranslateX();
            this.ctxCanvas.translate(-(this.xMarker - this.halfPainelX), 0);
            this.displacingXAxis = this.xMarker - this.halfPainelX;
        }
        //Se o Traker (this.xMarker) estiver antes da metade do painel e se tiver translocação (this.displacingXAxis) ele joga a translocação para o inicio ou seja reset.
        if (this.xMarker < this.halfPainelX && this.displacingXAxis != 0) {
            this.resetTranslateX();
        }
        //Se o Traker (this.xMarker) e estiver depois da metade do painel e a translocação tiver passado do traker faz com que o traker fica centralizado no meio do painel
        if (this.xMarker > this.halfPainelX && this.displacingXAxis > this.xMarker) {
            this.resetTranslateX();
            this.ctxCanvas.translate(-(this.xMarker - this.halfPainelX), 0);
            this.displacingXAxis = this.xMarker - this.halfPainelX;
        }
    }
    // //Levar para o inicio do canvas
    resetTranslate() {
        //console.log("xsxsxsxsResete")
        //console.log("xsxsxsxsResete :"+this.displacingXAxis)
        this.ctxCanvas.translate(this.displacingXAxis, this.displacingYAxis);
        this.displacingXAxis = 0;
        this.displacingYAxis = 0;
        // this.lastX = 0;
        // this.lastY = 0;
    }
    ;
    resetTranslateX() {
        //console.log("xsxsxsxsResete")
        //console.log("xsxsxsxsResete :"+this.displacingXAxis)
        console.log("RESTE DISPLACING X: " + this.displacingXAxis);
        this.ctxCanvas.translate(this.displacingXAxis, 0);
        this.displacingXAxis = 0;
        this.lastX = 0;
    }
    ;
    resetTranslateY() {
        //console.log("xsxsxsxsResete")
        //console.log("xsxsxsxsResete :"+this.displacingXAxis)
        console.log("RESTE DISPLACING Y: " + this.displacingXAxis);
        this.ctxCanvas.translate(0, this.displacingYAxis);
        this.displacingYAxis = 0;
        this.lastY = 0;
    }
    ;
    //Desenha o itemMixPaneler
    stopDrawLoopMarker() {
        this.flagDrawMaker = false;
        this.resetTranslate();
        this.reMake();
    }
    ;
    //Despausar
    cancelPause() {
        this.flagDrawMaker = false;
        //   this.resetTranslate();
        this.reMake();
    }
    ;
    //Pause draw
    pauseDrawLoopMarker() {
        this.flagDrawMaker = false;
    }
    ;
    //get position X de acordo com o tempo
    getXbySeconds(seconds) {
        var positionX = seconds * this.pixelPerSecond;
        return positionX;
    }
    ;
}
// /*  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
// Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// */
// // //Metodo temporario para gerar uma cor
// // function getColor() {
// //  
// //   var r = String(Math.floor(Math.random() * (255 + 1))),
// //     g = String(Math.floor(Math.random() * (255 + 1))),
// //     b = String(Math.floor(Math.random() * (255 + 1))),
// //     rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
// //   return rgb;
// // }
