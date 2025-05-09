"use strict";
/*  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
class FileWav extends FileAPI {
    constructor(sequenciador, dao) {
        super(sequenciador, dao);
    }
    //Função setada no botao do FileWav, para ser chamada toda vez que ele for clicado
    //Quando a função  handle termina de carregar os arquivos é chamado a função load files
    //para fazer o processamento
    loadFilesWav(files) {
        var listNames = [], bufferList = [], nameList = [], contador = 0;
        //Nome dos arquivos que vao ser carregados
        for (let i = 0; i < files.length; i = i + 1) {
            listNames[i] = files[i].name;
        }
        for (let i = 0; i < files.length; i = i + 1) {
            let f = files[i];
            let reader = new FileReader();
            reader.onload = ((theFile) => {
                return (evt) => {
                    let itemBuffer = new ItemBuffer();
                    itemBuffer.buffer = evt.target.result;
                    itemBuffer.name = theFile.name;
                    bufferList.push(itemBuffer);
                    contador = contador + 1;
                    if (contador == files.length) {
                        this.onReaderWav(bufferList);
                    }
                };
            })(f);
            reader.readAsArrayBuffer(f);
        }
    }
    validColor(color) {
        var isOk = false;
        if (color.indexOf("#") > -1) {
            console.log(color);
            isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
        }
        return isOk;
    }
    getColor(name) {
        return name.substring(name.indexOf("#"), name.indexOf("#") + 7);
    }
}
