"use strict";
class Painel {
    constructor(daoHome, ctxCanvas, canvas, pageSoundSphereHome) {
        this.touchFunctions = new TouchFunctions();
        this.contId = 0;
        this.flagDrawMaker = false;
        this.pixelPerSecond = 20;
        this.totalTime = 0;
        this.sizeTrail = 40;
        this.heightPainel = 0;
        this.widthPainel = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.displacingYAxis = 0;
        this.displacingXAxis = 0;
        this.lastMove = undefined;
        this.xMarker = 0;
        this.lastMakerX = 0;
        this.move = false;
        this.moved = false;
        this.DAOHome = daoHome;
        //console.log("DAO HOME")
        //console.log(this.DAOHome.listItemBuffer)
        this.pageSoundSphereHome = pageSoundSphereHome;
        this.canvas = canvas;
        this.halfPainel = (this.canvas.width / 2);
        this.ctxCanvas = ctxCanvas;
        this.make();
        this.setSettings();
        this.unselectedAlbumItem();
    }
    actionMouseDown(event) {
        //console.log("actionMouseDown")
        this.move = true;
        //console.log(" this.move ->" + this.move)
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
                    this.pageSoundSphereHome.itemMixOption.setIdSemanticDescriptor(itemMixTemp.getidSemanticDescriptor());
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
            let seconds = this.getSecondsByXPosition(this.getPositionX(event) + this.displacingXAxis);
            if (seconds <= this.totalTime) {
                this.xMarker = this.getPositionX(event) + this.displacingXAxis;
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
                if (this.move) {
                    var sizeMoviment = 10;
                    var deltaX = evt.offsetX - this.lastX;
                    var deltaY = evt.offsetY - this.lastY;
                    //normalizaDelta para não ficar se movimentao mto
                    if (deltaX >= 1) {
                        deltaX = sizeMoviment;
                    }
                    if (deltaX <= -1) {
                        deltaX = -sizeMoviment;
                    }
                    var deltaY = evt.offsetY - this.lastY;
                    //normalizaDelta para não ficar se movimentao mto
                    if (deltaY >= 1) {
                        deltaY = sizeMoviment;
                    }
                    if (deltaY <= -1) {
                        deltaY = -sizeMoviment;
                    }
                    this.lastX = evt.offsetX;
                    this.lastY = evt.offsetY;
                    let maxDisplacingXAxis = this.widthPainel - this.canvas.width;
                    let maxDisplacingYAxis = this.heightPainel - this.canvas.height;
                    if (this.displacingXAxis >= 0 && this.displacingXAxis <= maxDisplacingXAxis) {
                        if (this.displacingXAxis + (deltaX * -1) > maxDisplacingXAxis) {
                            this.displacingXAxis = maxDisplacingXAxis;
                        }
                        else if (this.displacingXAxis + (deltaX * -1) < 0) {
                            this.displacingXAxis = 0;
                        }
                        else {
                            this.displacingXAxis -= deltaX;
                            this.ctxCanvas.translate(deltaX, 0);
                        }
                    }
                    if (this.displacingYAxis >= 0 && this.displacingYAxis <= maxDisplacingYAxis) {
                        if (this.displacingYAxis + (deltaY * -1) > maxDisplacingYAxis) {
                            this.displacingYAxis = maxDisplacingYAxis;
                        }
                        else if (this.displacingYAxis + (deltaY * -1) < 0) {
                            this.displacingYAxis = 0;
                        }
                        else {
                            this.displacingYAxis -= deltaY;
                            this.ctxCanvas.translate(0, deltaY);
                        }
                    }
                    //console.log("moveu");
                    this.moved = true;
                    this.reMake();
                }
            }
        }
    }
    ;
    setSettings() {
        //Touch Event
        this.canvas.addEventListener("touchstart", (evt) => this.actionStartTouchInPanel(evt), false);
        this.canvas.addEventListener('touchmove', (evt) => this.actionMoveTouchInPanel(evt), false);
        this.canvas.addEventListener("touchend", (evt) => this.actionEndNormalTouchInPanel(evt), false);
        this.canvas.addEventListener("touchleave", (evt) => this.actionEndTouchInPanel(evt), false);
        this.canvas.addEventListener("touchcancel", (evt) => this.actionEndTouchInPanel(evt), false);
        //Mouse event
        this.canvas.addEventListener("touchcancel", (evt) => this.actionEndTouchInPanel(evt), false);
        this.canvas.addEventListener("dblclick", (evt) => { evt.preventDefault(); }, false);
        this.canvas.addEventListener("mousedown", (evt) => this.actionMouseDown(evt));
        this.canvas.addEventListener("mouseout", (evt) => this.actionMouseOut(evt));
        this.canvas.addEventListener("mouseup", (evt) => this.actionMouseUp(evt));
        this.canvas.addEventListener("mousemove", (evt) => this.actionMouseMove(evt));
    }
    //Função para re desenhar o painel
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
        $('canvas').css("cursor", "copy");
    }
    unselectedAlbumItem() {
        $('canvas').css("cursor", "grab");
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
    actionMoveTouchInPanel(e) {
        //console.log("move toush");
        if (this.move) {
            //console.log("--Painel se movimentando")
            let offset = this.touchFunctions.getOffset(this.canvas);
            let sizeMoviment = 50;
            let moveX = e.touches[0].pageX - offset.left;
            let moveY = e.touches[0].pageY - offset.top;
            let deltaX;
            let deltaY;
            if (this.lastX != undefined && this.lastY != undefined) {
                deltaX = moveX - this.lastX;
                deltaY = moveY - this.lastY;
            }
            else {
                deltaX = 0;
                deltaY = 0;
            }
            //normalizaDelta para não ficar se movimentao mto
            if (deltaX >= 1) {
                deltaX = sizeMoviment;
            }
            if (deltaX <= -1) {
                deltaX = -sizeMoviment;
            }
            //normalizaDelta para não ficar se movimentao mto
            if (deltaY >= 1) {
                deltaY = sizeMoviment;
            }
            if (deltaY <= -1) {
                deltaY = -sizeMoviment;
            }
            this.lastX = moveX;
            this.lastY = moveY;
            let maxDisplacingXAxis = this.widthPainel - this.canvas.width;
            let maxDisplacingYAxis = this.heightPainel - this.canvas.height;
            if (this.displacingXAxis >= 0 && this.displacingXAxis <= maxDisplacingXAxis) {
                if (this.displacingXAxis + (deltaX * -1) > maxDisplacingXAxis) {
                    this.displacingXAxis = maxDisplacingXAxis;
                }
                else if (this.displacingXAxis + (deltaX * -1) < 0) {
                    this.displacingXAxis = 0;
                }
                else {
                    this.displacingXAxis -= deltaX;
                    this.ctxCanvas.translate(deltaX, 0);
                }
            }
            else { }
            if (this.displacingYAxis >= 0 && this.displacingYAxis <= maxDisplacingYAxis) {
                if (this.displacingYAxis + (deltaY * -1) > maxDisplacingYAxis) {
                    this.displacingYAxis = maxDisplacingYAxis;
                }
                else if (this.displacingYAxis + (deltaY * -1) < 0) {
                    this.displacingYAxis = 0;
                }
                else {
                    this.displacingYAxis -= deltaY;
                    this.ctxCanvas.translate(0, deltaY);
                }
            }
            else {
                //console.log("actionMoveTouchInPanel não moveu")
            }
            //console.log("teste movimendo");
            this.moved = true;
            this.reMake();
        }
    }
    actionStartTouchInPanel(evt) {
        //console.log("Iniciou o touch")
        if (this.pageSoundSphereHome.panelReleased) {
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
                evt.preventDefault();
                //console.log("é android");
                //console.log("lastMovov: " + event);
                this.lastMove = event;
            }
            this.move = true;
        }
    }
    //FUnção para desenhar/criar o painel
    make() {
        this.setTimePanel(300);
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
        var x = this.sizeTrail;
        this.ctxCanvas.beginPath();
        this.ctxCanvas.fillStyle = '#FFFFFF';
        //Converte os segundos no tamanho a ser inserido
        this.ctxCanvas.fillRect(0, 0, this.widthPainel, this.heightPainel);
        this.ctxCanvas.beginPath();
        for (x; x < this.heightPainel; x += this.sizeTrail) {
            this.ctxCanvas.moveTo(0, x);
            this.ctxCanvas.lineTo(this.widthPainel, x);
        }
        this.ctxCanvas.strokeStyle = "#000";
        this.ctxCanvas.stroke();
    }
    ;
    //Desenha as linha das trilhas
    drawGridTime() {
        var x = this.pixelPerSecond;
        var y = 0;
        this.ctxCanvas.beginPath();
        for (x; x <= this.widthPainel; x += this.pixelPerSecond) {
            var xcoodenate = x + 0.5;
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
    }
    //Get Time para ser usado na grid
    getTimeGrid(y) {
        var time = '';
        var segundos = y / this.pixelPerSecond;
        var segundo = segundos % 60;
        var minutos = segundos / 60;
        var minuto = minutos % 60;
        var hora = minutos / 60;
        if (Math.floor(segundos) <= 0) {
            time = '00' + time;
        }
        if (Math.floor(segundos) > 0) {
            time = Math.floor(segundo) + time;
        }
        if (Math.floor(minutos) > 0) {
            time = Math.floor(minuto) + ':' + time;
        }
        if (Math.floor(hora) > 0) {
            time = ':' + Math.floor(hora) + ':' + time;
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
        //console.log("getItem");
        var remove = new ItemMixPanel();
        remove.width = (this.pixelPerSecond);
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPod/i))) {
            remove.x = this.getPositionX(this.lastMove) + this.displacingXAxis;
            remove.y = this.getMiddleHeigtTrail(this.getPositionY(this.lastMove) + this.displacingYAxis);
        }
        else {
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
    //Função que tentar inserir desenhar/inserir o item no Painel
    //caso não seja possivel ela da uma mensagem informando o usuario
    insertItemMixPanel(idSoundIconSelect) {
        //console.log("Tentou inserir");
        let idBuffer = idSoundIconSelect;
        //console.log("Id:")
        //console.log(idSoundIconSelect)
        //console.log("    itemMixPanel.color = this.DAOHome.listItembuffer[idBuffer].color:")
        //console.log(this.DAOHome.listItemBuffer)
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
        let listColisoes = this.checkItemMixPanel(itemMixPanel);
        let qt;
        let desenha = false;
        if (listColisoes.length === 1) {
            //caso o itemMixPanelseja colado sobre outro ele direciona ele para a direita do mesmo
            if (itemMixPanel.x >= listColisoes[0].x && itemMixPanel.x <= listColisoes[0].x + listColisoes[0].width) {
                itemMixPanel.x = listColisoes[0].x + listColisoes[0].width;
                if (this.checkItemMixPanel(itemMixPanel).length === 0) {
                    desenha = true;
                }
            }
            if ((itemMixPanel.x + itemMixPanel.width) > listColisoes[0].x && itemMixPanel.x < listColisoes[0].x) {
                itemMixPanel.x = itemMixPanel.x - ((itemMixPanel.x + itemMixPanel.width) - listColisoes[0].x);
                if (this.checkItemMixPanel(itemMixPanel).length === 0) {
                    desenha = true;
                }
            }
        }
        else if (listColisoes.length === 0) {
            desenha = true;
        }
        if (itemMixPanel.x < 0 || (itemMixPanel.x + itemMixPanel.width) > this.widthPainel) {
            desenha = false;
        }
        if (desenha) {
            //Caso seja possivel inserir ele é desenhado no painel e é definido o tempo de inicio,
            //é definido um ID
            itemMixPanel.draw(this);
            itemMixPanel.startTime = this.getSecondsByXPosition(itemMixPanel.x);
            itemMixPanel.endTime = itemMixPanel.startTime + itemMixPanel.seconds;
            this.contId = this.contId + 1;
            itemMixPanel.id = this.contId;
            this.pushItemMixPanel(itemMixPanel);
            var i;
            //Salva no local storage
            // this.DAOHome.saveLocalStorage();
        }
    }
    //get quantidade de segundos de acordo com  X
    getSecondsByXPosition(xCoordate) {
        var seconds = xCoordate / this.pixelPerSecond;
        return seconds;
    }
    ;
    //Adiciona itemMixPanel
    pushItemMixPanel(itemMixPanel) {
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        //console.log("this.DAOHome.listItemMixPanel[linha].push(itemMixPanel)")
        //console.log(this.DAOHome.listItemMixPanel)
        if (this.DAOHome.listItemMixPanel[linha] == undefined) {
            this.DAOHome.listItemMixPanel[linha] = new Array();
            this.DAOHome.listItemMixPanel[linha].push(itemMixPanel);
        }
        else {
            this.DAOHome.listItemMixPanel[linha].push(itemMixPanel);
        }
    }
    ;
    updateItemMixPanel(itemMixPanel) {
        //console.log("YYYYYYYYY")
        //console.log(itemMixPanel.y);
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        itemMixPanel.x = this.getXbySeconds(itemMixPanel.startTime);
        let newLinha = linha;
        let podeInserir = false;
        let teveColisao = false;
        //Enquanto não poder inserir continue
        do {
            teveColisao = false;
            //percorre toda a lista de de itens da newLinha
            //console.log("Indicou o do")
            if (this.DAOHome.listItemMixPanel[newLinha] != undefined) {
                //console.log("Verificando lista != UNDEFINID")
                for (let index = 0; index < this.DAOHome.listItemMixPanel[newLinha].length; index++) {
                    //Se for diferente do item que estamos tentando inserir
                    if (this.DAOHome.listItemMixPanel[newLinha][index].id != itemMixPanel.id) {
                        //Se teve colisao
                        if (this.checkCollision(this.DAOHome.listItemMixPanel[newLinha][index].getColisao(), itemMixPanel.getColisao())) {
                            teveColisao = true;
                            newLinha = newLinha + 1;
                            itemMixPanel.y = itemMixPanel.y + this.sizeTrail;
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
                podeInserir = true;
            }
        } while (!podeInserir);
        if (linha == newLinha) {
            for (let index = 0; index < this.DAOHome.listItemMixPanel[linha].length; index++) {
                //Se for diferente do item que estamos tentando inserir
                if (this.DAOHome.listItemMixPanel[linha][index].id == itemMixPanel.id) {
                    this.DAOHome.listItemMixPanel[linha][index].setVolume(itemMixPanel.getVolume());
                    this.DAOHome.listItemMixPanel[linha][index].setIdSemanticDescriptor(itemMixPanel.getidSemanticDescriptor());
                    this.DAOHome.listItemMixPanel[linha][index].startTime = itemMixPanel.startTime;
                    this.DAOHome.listItemMixPanel[linha][index].x = itemMixPanel.x;
                    this.DAOHome.listItemMixPanel[linha][index].endTime = itemMixPanel.endTime;
                    this.DAOHome.listItemMixPanel[linha][index].solo = itemMixPanel.solo;
                    this.DAOHome.listItemMixPanel[linha][index].changeStardValues();
                }
            }
        }
        else {
            //console.log("Teve que mduar para a linha: " + newLinha)
            for (let index = 0; index < this.DAOHome.listItemMixPanel[linha].length; index++) {
                //Se for diferente do item que estamos tentando inserir
                if (this.DAOHome.listItemMixPanel[linha][index].id == itemMixPanel.id) {
                    this.DAOHome.listItemMixPanel[linha].splice(index, 1);
                }
            }
            if (this.DAOHome.listItemMixPanel[newLinha] == undefined) {
                itemMixPanel.y = ((newLinha * this.sizeTrail) + (this.sizeTrail / 2));
                this.DAOHome.listItemMixPanel[newLinha] = new Array();
                this.DAOHome.listItemMixPanel[newLinha].push(itemMixPanel);
            }
            else {
                this.DAOHome.listItemMixPanel[newLinha].push(itemMixPanel);
            }
        }
        //console.log(this.DAOHome.listItemMixPanel)
        this.reMake();
    }
    deleteItemMixPanel(itemMixPanel) {
        var linha = this.getNumberTrailByHeight(itemMixPanel.y) - 1;
        //console.log("this.DAOHome.listItemMixPanel[linha].push(itemMixPanel)")
        //console.log(this.DAOHome.listItemMixPanel)
        for (let index = 0; index < this.DAOHome.listItemMixPanel[linha].length; index++) {
            if (this.DAOHome.listItemMixPanel[linha][index].id == itemMixPanel.id) {
                this.DAOHome.listItemMixPanel[linha][index].excluded = true;
                break;
            }
        }
        this.reMake();
    }
    //função para controlar o movimento no eixo x de acordo com a movimentaçãp do mouse
    endMove() {
        this.move = false;
        this.moved = false;
        this.lastX = 0;
        this.lastY = 0;
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
    //Função responsavel por mover o painel dentro do canvas
    moveDisplacingXMarker(currentMarkerX) {
        //Condição para passar da metade
        //console.log( this.displacingXAxis)
        if (currentMarkerX > this.halfPainel) {
            let deltaX = currentMarkerX - this.lastMakerX;
            //console.log("Delta x: "+deltaX)
            ////console.log("Delta x em segundos: "+this.getSecondsByXPosition(deltaX));
            let maxDisplacingXAxis = this.widthPainel - this.canvas.width;
            //if para verificar se o movimento do quadrante xDisplacingXaxis
            //é maior devido a mudança do marker no pause.
            //console.log("Delta x: "+deltaX)
            //console.log("Movendo normal")
            if (this.displacingXAxis >= 0 && this.displacingXAxis <= maxDisplacingXAxis) {
                if (this.displacingXAxis + (deltaX) < maxDisplacingXAxis) {
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
            let ctx = this.ctxCanvas;
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
        this.animationPlayPanel();
    }
    ;
    ajustDisplacing() {
        //console.log("Half panel: "+this.halfPainel)
        //console.log("Displacing G: "+this.displacingXAxis)
        //console.log("X marker: "+this.xMarker)
        if (this.xMarker > this.halfPainel && this.displacingXAxis < this.xMarker - this.halfPainel) {
            this.ctxCanvas.translate(-(this.xMarker - this.halfPainel - this.displacingXAxis), 0);
            this.displacingXAxis = this.xMarker - this.halfPainel;
        }
    }
    // //Levar para o inicio do canvas
    resetTranslate() {
        //console.log("xsxsxsxsResete")
        //console.log("xsxsxsxsResete :"+this.displacingXAxis)
        this.ctxCanvas.translate(this.displacingXAxis, this.displacingYAxis);
        this.displacingXAxis = 0;
        this.displacingYAxis = 0;
        this.lastX = 0;
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
