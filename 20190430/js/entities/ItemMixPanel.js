"use strict";
/*  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
class ItemMixPanel {
    constructor() {
        this.excluded = false;
        this.startTime = 0;
        this.endTime = 0;
        this.id = 0;
        this.idBuffer = 0;
        this.idSemanticDescriptor = undefined;
        this.codeSemanticDescriptor = undefined;
        this.x = 0;
        this.y = 0;
        this.solo = true;
        this.color = '';
        this.volume = 100;
        this.standardValue = true;
        this.seconds = 0;
        this.width = 0;
        this.height = 2;
        this.size = 0;
        this.style = 'black';
    }
    //Desenhar gradient
    // var my_gradient = painel.ctxCanvas.createLinearGradient((this.x+(this.width/2)), y, (this.x+(this.width/2)), y+(height));
    // const cor = (this.idSemanticDescriptor-1)*20;
    // my_gradient.addColorStop(0, this.colorGray[this.idSemanticDescriptor]);
    // my_gradient.addColorStop(1, this.color);
    // painel.ctxCanvas.fillStyle  = my_gradient;
    drawPadrao(painel, y, height) {
        if (this.solo) {
            painel.ctxCanvas.fillStyle = this.color;
            console.log("ESSA COR? " + this.color);
        }
        else {
            painel.ctxCanvas.fillStyle = "#C0C0C0";
        }
        painel.ctxCanvas.fillRect(this.x, y, this.width, height);
        if (this.idSemanticDescriptor != undefined) {
            let verticalSpacing = 12;
            for (var i = 0; i < 3; i++) {
                if (this.codeSemanticDescriptor[i] != undefined) {
                    painel.ctxCanvas.save();
                    painel.ctxCanvas.font = "bold 12px Verdana";
                    painel.ctxCanvas.fillStyle = "black";
                    painel.ctxCanvas.fillText(this.codeSemanticDescriptor[i], this.x + 3, y + 10 + i * verticalSpacing);
                    painel.ctxCanvas.restore();
                }
            }
        }
    }
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // linhasRetaslinhasRetas(painel: any, y: number, height: number){
    //   y = this.y-19;
    //   height = 38;
    //   console.log("100 height: "+height);
    //   let count = 0;
    //   let passo = 10;
    //   let borda = 2;
    //   for (let dif = 2; dif < this.width; dif += passo) {
    //     painel.ctxCanvas.beginPath();
    //     painel.ctxCanvas.strokeStyle = "red";
    //     painel.ctxCanvas.lineWidth  = 2;
    //     painel.ctxCanvas.moveTo(this.x + dif + borda, y + borda);
    //     if (this.x + dif + 20 < this.width + this.x) {
    //       painel.ctxCanvas.lineTo(this.x + dif + borda, y + height - borda);
    //     } else {
    //       count++;
    //       painel.ctxCanvas.lineTo(this.x + dif + borda, y + height - borda);
    //     }
    //     painel.ctxCanvas.stroke();
    //     painel.ctxCanvas.closePath();
    //   }
    // }
    // linhasAngular(painel: any, y: number, height: number){
    //   let count = 0;
    //   let passo = 10;
    //   let borda = 0;
    //   let lastXvalid=0;
    //   for (let dif = 0; this.x + dif + borda < this.width+this.x; dif += passo) {
    //     painel.ctxCanvas.beginPath();
    //     painel.ctxCanvas.strokeStyle = "black";
    //     painel.ctxCanvas.moveTo(this.x + dif + borda, y + borda);
    //     if (this.x + dif + 20 <= this.width + this.x) {
    //       painel.ctxCanvas.lineTo(this.x + dif +20, y + height - borda);
    //       lastXvalid = this.x + dif +20;
    //     }else{
    //       //  count++
    //       //  painel.ctxCanvas.lineTo(this.x+this.width, y + height - borda -(count*passo));
    //     } 
    //     painel.ctxCanvas.stroke();
    //     painel.ctxCanvas.closePath();
    //   }
    // }
    draw(painel) {
        painel.ctxCanvas.beginPath();
        let y;
        let height;
        y = (this.y - ((38 * this.volume / 100) / 2));
        if (this.volume == 0) {
            y = (this.y - ((38 * 10 / 100) / 2));
            height = (38 * 10 / 100);
            painel.ctxCanvas.fillStyle = "#C0C0C0";
            painel.ctxCanvas.fillRect(this.x, y - 2, this.width, height + 4);
            this.drawPadrao(painel, y, height);
        }
        else {
            const volumeNormatizado = this.volume > 100 ? 100 : this.volume;
            y = (this.y - ((38 * volumeNormatizado / 100) / 2));
            height = (38 * volumeNormatizado / 100);
            this.drawPadrao(painel, y, height);
        }
        painel.ctxCanvas.globalCompositeOperation = 'source-over';
        //Converte os segundos no tamanho a ser inserid
    }
    setVolume(volume) {
        this.volume = volume;
        this.changeStardValues();
    }
    getVolume() {
        return this.volume;
    }
    setIdSemanticDescriptor(idSemanticDescriptor) {
        this.idSemanticDescriptor = idSemanticDescriptor;
        this.changeStardValues();
    }
    setCodeSemanticDescriptor(codeSemanticDescriptor) {
        this.codeSemanticDescriptor = codeSemanticDescriptor;
        this.changeStardValues();
    }
    getStandardValues() {
        return this.standardValue;
    }
    changeStardValues() {
        if (this.volume == 100 && this.idSemanticDescriptor == undefined) {
            //console.log("Set true ITEm mix")
            this.standardValue = true;
        }
        else {
            //console.log("Set false ITEm mix")
            this.standardValue = false;
        }
    }
    getidSemanticDescriptor() {
        return this.idSemanticDescriptor;
    }
    getCodeSemanticDescriptor() {
        return this.codeSemanticDescriptor;
    }
    getColisao() {
        "use strict";
        let colisao = { x: this.x, y: this.y, width: this.width, height: this.height };
        return colisao;
    }
    ;
    colidiu() {
        //console.log('Colidiu');
    }
    ;
    getCodeIdentificationItemMixPanel() {
        return {
            idBuffer: this.idBuffer,
            volume: this.volume,
            idSemanticDescriptor: this.getidSemanticDescriptor()
        };
    }
}
