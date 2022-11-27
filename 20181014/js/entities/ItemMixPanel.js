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
    drawPadrao(painel, y, height) {
        if (this.solo) {
            painel.ctxCanvas.fillStyle = this.color;
        }
        else {
            painel.ctxCanvas.fillStyle = "#C0C0C0";
        }
        painel.ctxCanvas.fillRect(this.x, y, this.width, height);
    }
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
            y = (this.y - ((38 * this.volume / 100) / 2));
            height = (38 * this.volume / 100);
            this.drawPadrao(painel, y, height);
        }
        painel.ctxCanvas.globalCompositeOperation = 'source-over';
        //Converte os segundos no tamanho a ser inserid
        if (this.volume != 0) {
        }
        else {
            painel.ctxCanvas.fillRect(this.x, y, this.width, height);
            painel.ctxCanvas.fillRect(this.x, y, this.width, height);
        }
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
