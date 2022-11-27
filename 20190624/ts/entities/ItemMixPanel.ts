/*  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
class ItemMixPanel {

  x: number
  y: number
  private standardValue: boolean;
  solo: boolean
  linha: number=0
  excluded: boolean = false
  startTime: number = 0
  endTime: number = 0
  id: number = 0
  idBuffer: number = 0
  color: string
  //Teste de descritor com gradiente
  //  colorGray: string[] = ["rgb(0,0,0)", "rgb(112,128,144)", "	rgb(105,105,105)", "rgb(128,128,128)",
  //    "rgb(169,169,169)", "rgb(192,192,192)", "rgb(211,211,211)", "rgb(220,220,220)", "rgb(240,240,240)"]
  private volume: number
  private idSemanticDescriptor: number | undefined = undefined
  private codeSemanticDescriptor: string | undefined = undefined
  seconds: number
  width: number
  height: number
  size: number
  style: string
  constructor() {
    this.x = 0;
    this.y = 0;
    this.solo = true;
    this.color = '';
    this.volume = 100;
    this.standardValue = true
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
  drawPadrao(painel: any, y: number, height: number, yDescritor: number) {
    if (this.solo) {
      painel.ctxCanvas.fillStyle = this.color;
      
    } else {
      painel.ctxCanvas.fillStyle = "#C0C0C0";
    }
    painel.ctxCanvas.fillRect(this.x, y, this.width, height);
    // console.log("this.idSemanticDescriptor")
    // console.log(this.idSemanticDescriptor)
    // console.log(this.codeSemanticDescriptor)
    if (this.idSemanticDescriptor != undefined) {
      let verticalSpacing = 12;
      
      for (var i = 0; i < 3; i++) {
        if (this.codeSemanticDescriptor![i] != undefined) {



          painel.ctxCanvas.save();
          painel.ctxCanvas.font = "12px verdana";
          painel.ctxCanvas.shadowColor = "black";
          painel.ctxCanvas.shadowBlur = 0;
          painel.ctxCanvas.lineWidth = 4;
         painel.ctxCanvas.strokeText(this.codeSemanticDescriptor![i], this.x + 3, yDescritor + 10 + i * verticalSpacing);
      
          painel.ctxCanvas.shadowBlur = 0;
  


          // painel.ctxCanvas.shadowOffsetX = -1;
          // painel.ctxCanvas.shadowOffsetY = 0;
          // painel.ctxCanvas.shadowBlur = 0;
          // painel.ctxCanvas.shadowColor = "rgb(255,255,255)";
          // painel.ctxCanvas.font = "bold 12px Verdana";
          // painel.ctxCanvas.fillStyle = "black";
        //  painel.ctxCanvas.fillText(this.codeSemanticDescriptor![i], this.x + 3, yDescritor + 10 + i * verticalSpacing);
         
          painel.ctxCanvas.fillStyle = "white";
          painel.ctxCanvas.fillText(this.codeSemanticDescriptor![i], this.x + 3, yDescritor + 10 + i * verticalSpacing);
      
          painel.ctxCanvas.restore();
        }

      }

    }




  }

  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  // linhasRetaslinhasRetas(painel: any, y: number, height: number){
  //   y = this.y-19;
  //   height = sizeVolume;
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
  draw(painel: any): void {
    painel.ctxCanvas.beginPath();
    let yVolume;
    let height;
    let sizeVolume = 38;
    yVolume = (this.y - ((sizeVolume * this.volume / 100) / 2));
    let yDescritor = this.y - (sizeVolume / 2);
    if (this.volume == 0) {
      yVolume = (this.y - ((sizeVolume * 10 / 100) / 2))
      height = (sizeVolume * 10 / 100)
      painel.ctxCanvas.fillStyle = "#C0C0C0";
      painel.ctxCanvas.fillRect(this.x, yVolume - 2, this.width, height + 4);
      this.drawPadrao(painel, yVolume, height, yDescritor);
    } else {
      const volumeNormatizado = this.volume > 100 ? 100 : this.volume;
      yVolume = (this.y - ((sizeVolume * volumeNormatizado / 100) / 2))
      height = (sizeVolume * volumeNormatizado / 100)
      this.drawPadrao(painel, yVolume, height, yDescritor);
    }
    painel.ctxCanvas.globalCompositeOperation = 'source-over';
    //Converte os segundos no tamanho a ser inserid

  }
  setVolume(volume: number) {
    this.volume = volume;
    this.changeStardValues()
  }
  getVolume(): number {
    return this.volume
  }
  setIdSemanticDescriptor(idSemanticDescriptor: number | undefined) {
    this.idSemanticDescriptor = idSemanticDescriptor;
    this.changeStardValues()
  }
  getIdSemanticDescriptor(){
    return this.idSemanticDescriptor;
  }
  setCodeSemanticDescriptor(codeSemanticDescriptor: string | undefined) {
    this.codeSemanticDescriptor = codeSemanticDescriptor;
    this.changeStardValues()
  }
  getStandardValues(): boolean {
    return this.standardValue
  }
  changeStardValues() {
    if (this.volume == 100 && this.idSemanticDescriptor == undefined) {
      //console.log("Set true ITEm mix")
      this.standardValue = true
    } else {
      //console.log("Set false ITEm mix")
      this.standardValue = false
    }
  }
  getidSemanticDescriptor(): number | undefined {
    return this.idSemanticDescriptor
  }
  getCodeSemanticDescriptor(): string | undefined {
    return this.codeSemanticDescriptor
  }

  getColisao(): any {
    "use strict";
    let colisao = { x: this.x, y: this.y, width: this.width, height: this.height };

    return colisao;
  };
  colidiu(): void {
    //console.log('Colidiu');
  };
  getCodeIdentificationItemMixPanel() {
    return {
      idBuffer: this.idBuffer,
      volume: this.volume,
      idSemanticDescriptor: this.getidSemanticDescriptor()

    }
  }
  // x: number
  // y: number
  // private standardValue: boolean;
  // solo: boolean
  // linha: number=0
  // excluded: boolean = false
  // startTime: number = 0
  // endTime: number = 0
  // id: number = 0
  // idBuffer: number = 0
  // color: string
  // //Teste de descritor com gradiente
  // //  colorGray: string[] = ["rgb(0,0,0)", "rgb(112,128,144)", "	rgb(105,105,105)", "rgb(128,128,128)",
  // //    "rgb(169,169,169)", "rgb(192,192,192)", "rgb(211,211,211)", "rgb(220,220,220)", "rgb(240,240,240)"]
  // private volume: number
  // private idSemanticDescriptor: number | undefined = undefined
  // private codeSemanticDescriptor: string | undefined = undefined
  // seconds: number
  // width: number
  // height: number
  // size: number
  // style: string
  equals(other:ItemMixPanel){
    // console.log("EQUALS")
    // console.log(this.x)
    // console.log(other.x)
    // console.log(this.y)
    // console.log(other.y)
    // console.log(this.standardValue)
    // console.log(other.standardValue)
    // console.log(this.solo)
    // console.log(other.solo)
    // console.log(this.linha)
    // console.log(other.linha)
    // console.log(this.excluded)
    // console.log(other.excluded)
    // console.log(this.startTime)
    // console.log(other.startTime)
    // console.log(this.endTime)
    // console.log(other.endTime)
    // console.log(this.id)
    // console.log(other.id)
    // console.log(this.idBuffer)
    // console.log(other.idBuffer)
    // console.log(this.color)
    // console.log(other.color)
    // console.log(this.volume)
    // console.log(other.volume)
    // console.log(this.idSemanticDescriptor)
    // console.log(other.idSemanticDescriptor)
    // console.log(this.codeSemanticDescriptor)
    // console.log(other.codeSemanticDescriptor)
    // console.log(this.seconds)
    // console.log(other.seconds)
    // console.log(this.width)
    // console.log(other.width)
    // console.log(this.height)
    // console.log(other.height)
    // console.log(this.size)
    // console.log(other.size)
    // console.log(this.style)
    // console.log(other.style)
    return this.x === other.x &&
    this.y === other.y &&
    this.standardValue === other.standardValue &&
    this.solo === other.solo &&
    this.linha === other.linha &&
    this.excluded === other.excluded &&
    this.startTime === other.startTime &&
    this.endTime === other.endTime &&
    this.id === other.id &&
    this.idBuffer === other.idBuffer &&
    this.color === other.color &&
    this.volume === other.volume &&
    this.idSemanticDescriptor === other.idSemanticDescriptor &&
    this.codeSemanticDescriptor === other.codeSemanticDescriptor &&
    this.seconds === other.seconds &&
    this.width === other.width &&
    this.height === other.height &&
    this.size === other.size &&
    this.style ===other.style;
  }
}
