"use strict";
/*@#  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
//Classe responsavel por gerenciar as informações da 
//aplicação no Local Storage e no arquivo JSON
class DAO {
    constructor(soundSphereInfo, listSemanticDescriptors, audioCtx, controlFiles) {
        this.listItemMixPanel = [];
        this.listItemBuffer = [];
        this.listItemBufferProv = [];
        this.listMessagesError = [];
        this.controlFiles = controlFiles;
        this.soundSphereInfo = soundSphereInfo;
        this.listSemanticDescriptors = listSemanticDescriptors;
        this.audioCtx = audioCtx;
    }
    isItemBufferLoadedByName(name) {
        for (let index = 0; index < this.listItemBuffer.length; index++) {
            if (this.listItemBuffer[index].name == name) {
                //    console.log("XXXXXX - Nome repetido: "+name)
                return true;
            }
        }
        console.log("-> ok: " + name);
        return false;
    }
    itemBufferHaveBufer(name) {
        for (let index = 0; index < this.listItemBuffer.length; index++) {
            if (this.listItemBuffer[index].name == name) {
                //    console.log("XXXXXX - Nome repetido: "+name)
                if (this.listItemBuffer[index].buffer != undefined) {
                    return true;
                }
                break;
            }
        }
        return false;
    }
    restartMixing() {
        this.listItemMixPanel = [];
    }
    getListNameOfBuffers() {
        let listName = [];
        for (let index = 0; index < this.listItemBuffer.length; index++) {
            listName.push(this.listItemBuffer[index].name);
        }
        return listName;
    }
    getNameSemanticDescriptor(id) {
        return this.listSemanticDescriptors[id].name;
    }
    loadBufferList(listAudioData, callback) {
        this.listMessagesError = [];
        this.listItemBufferProv = [];
        for (let index = 0; index < listAudioData.length; index++) {
            this.audioCtx.decodeAudioData(listAudioData[index].buffer).then((buffer) => {
                if (buffer.numberOfChannels == 1 || buffer.numberOfChannels == 2 || buffer.numberOfChannels == 4 || buffer.numberOfChannels == 6) {
                    // console.log("Inserindo buffer prov: listAudioData[index].name ")
                    // console.log(listAudioData[index].name)
                    this.listItemBufferProv.push(this.createItemBuffer(buffer, listAudioData[index].name));
                }
                else {
                    this.listMessagesError.push(listAudioData[index].name + " só são permitidos arquivos mono, stereo, quad e 5.1.");
                }
                //se  o tamanho da lista de itens provisiorios e o tamannho do errros somados juntos forem igual ao tamaho da lista decode, quer dizer que terminou
                if ((this.listItemBufferProv.length + this.listMessagesError.length) == listAudioData.length) {
                    // console.log("antes de create listnames")
                    // console.log(this.listItemBufferProv)
                    let listaNamesOk = this.createListNames(this.listItemBufferProv);
                    // console.log("Finalizando carregamento - Lista de nomes OK: ")
                    // console.log(listaNamesOk)
                    // console.log("Finalizando carregamento - Lista de nomes com erro: ")
                    // console.log(this.listMessagesError)
                    for (let index2 = 0; index2 < listaNamesOk.length; index2++) {
                        for (let index3 = 0; index3 < this.listItemBufferProv.length; index3++) {
                            if (listaNamesOk[index2] == this.listItemBufferProv[index3].name) {
                                console.log("Inserindo na lista de buffers OK: " + this.listItemBufferProv[index3].name);
                                this.listItemBufferProv[index3].color = this.controlFiles.getColor(this.listItemBuffer.length);
                                this.listItemBuffer.push(this.listItemBufferProv[index3]);
                                break;
                            }
                        }
                    }
                    console.log("Terminou de carregar lista de itens carregados");
                    console.log(this.listItemBuffer);
                    callback();
                }
            });
        }
    }
    //Cria a lista de nomes em ordem alfabetica
    createListNames(listItemBufferProv) {
        let listaNamesOk = [];
        console.log("-------------------------listItemBufferProv[index]");
        console.log(listItemBufferProv);
        console.log(listItemBufferProv.length);
        for (let index = 0; index < listItemBufferProv.length; index++) {
            console.log("Inseridno: " + listItemBufferProv[index].name);
            listaNamesOk.push(listItemBufferProv[index].name);
        }
        console.log("-------------------------listaNamesOk");
        console.log(listaNamesOk);
        let listaOrdenada = this.controlFiles.orderListByName(listaNamesOk);
        for (let index = 0; index < listaOrdenada.length; index++) {
            console.log(`${index} - ${listaOrdenada[index]}`);
        }
        return listaOrdenada;
    }
    // saveLocalStorage() {
    //     var soundSphereBD = new SoundSphereBD(this.listItemBuffer, this.listItemMixPanel, this.listSemanticDescriptors, this.soundSphereInfo.getVersion());
    //     localStorage.setItem("soundSphereBD", JSON.stringify(soundSphereBD));
    // }
    //Função para fazer o download do  JSON, dependendo do tipo de classe instanciada
    //gera arquivos com informações JSONS diferentes
    /**
     * @param  {ItemBuffer[]} bufferList
     * @param  {ItemMixPanel[][]} listItemMixPanel
     */
    downloadJSON() {
        let a = document.createElement('a');
        let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.soundSphereDBToJson(this.listItemBuffer, this.listItemMixPanel, this.listSemanticDescriptors, this.soundSphereInfo)));
        a.href = 'data:' + data;
        var now = new Date();
        var nameFile = "SoundSphere A" + now.getFullYear() + "M" + (now.getMonth() + 1) + "D" + now.getDate() + "H" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
        a.download = nameFile + ".json";
        a.click();
    }
    eraserSoundSphereDB() {
        this.listItemBuffer = [];
        this.listItemMixPanel = [];
        this.listSemanticDescriptors = generatorSemaitsDescriptors();
    }
    //Nomes dos arquivos que estao no allDataJSONFile
    //Verifica se o arquivo foi gerado pelo soundsphere
    // checkValidJSONFile() {
    //     let lcAll = localStorage.getItem('allData');
    //     if (lcAll) {
    //         var allData = JSON.parse(lcAll);
    //         if (allData.bufferList != null && allData.listItemMixPanel != null) {
    //             return true;
    //         }
    //         else {
    //             return false;
    //         }
    //     }
    // }
    //QUantidade de buffers
    synchronizeSoundSphereDB(soundSphereBD) {
        this.synchronizeItemMixPanel(soundSphereBD.listItemMixPanel);
        this.syncronizeListItemBuffers(soundSphereBD.listItemBuffer);
        this.synchronizeSemanticDescriptor(soundSphereBD);
    }
    syncronizeListItemBuffers(listBuffer) {
        this.listItemBuffer = [];
        for (let index = 0; index < listBuffer.length; index++) {
            let itemBuffer = new ItemBuffer();
            itemBuffer.name = listBuffer[index].name;
            itemBuffer.timeDuration = listBuffer[index].timeDuration;
            itemBuffer.color = listBuffer[index].color;
            itemBuffer.numberOfChannels = listBuffer[index].numberOfChannels;
            this.listItemBuffer.push(itemBuffer);
        }
    }
    synchronizeSemanticDescriptor(soundSphereBD) {
        console.log("++++++++++++++++++++++synchronizeSemanticDescriptor");
        console.log(soundSphereBD.listSemanticDescriptor);
        this.listSemanticDescriptors = [];
        soundSphereBD.listSemanticDescriptor.forEach((element) => {
            let filters = [];
            element._filters.forEach(function (element2) {
                filters.push(new Filter(element2.type, element2.name, element2.frequency, element2.Q, element2.gain, element2.status));
            });
            this.listSemanticDescriptors.push(new SemanticDescriptor(element.name, filters));
        });
    }
    synchronizeItemMixPanel(listItemMixPanel) {
        this.listItemMixPanel = [];
        for (var i = 0; i < listItemMixPanel.length; i++) {
            if (listItemMixPanel[i] != undefined) {
                for (var j = 0; j < listItemMixPanel[i].length; j++) {
                    var itemMixPanel = new ItemMixPanel();
                    itemMixPanel.x = listItemMixPanel[i][j].x;
                    itemMixPanel.y = listItemMixPanel[i][j].y;
                    itemMixPanel.solo = Boolean(listItemMixPanel[i][j].solo);
                    itemMixPanel.startTime = listItemMixPanel[i][j].startTime;
                    itemMixPanel.endTime = listItemMixPanel[i][j].endTime;
                    itemMixPanel.id = listItemMixPanel[i][j].id;
                    itemMixPanel.excluded = listItemMixPanel[i][j].excluded;
                    itemMixPanel.idBuffer = listItemMixPanel[i][j].idBuffer;
                    itemMixPanel.color = listItemMixPanel[i][j].color;
                    itemMixPanel.setVolume(listItemMixPanel[i][j].volume);
                    itemMixPanel.seconds = listItemMixPanel[i][j].seconds;
                    itemMixPanel.width = listItemMixPanel[i][j].width;
                    itemMixPanel.height = listItemMixPanel[i][j].height;
                    itemMixPanel.size = listItemMixPanel[i][j].size;
                    itemMixPanel.style = listItemMixPanel[i][j].style;
                    itemMixPanel.changeStardValues();
                    itemMixPanel.setIdSemanticDescriptor(listItemMixPanel[i][j].idSemanticDescriptor);
                    if (this.listItemMixPanel[i] == undefined) {
                        this.listItemMixPanel[i] = new Array();
                        this.listItemMixPanel[i].push(itemMixPanel);
                    }
                    else {
                        this.listItemMixPanel[i].push(itemMixPanel);
                    }
                }
            }
        }
        //   this.controlPainel.enableOptionsItens();
    }
    //Função para faciliar o add Buffer
    createItemBuffer(buffer, name) {
        var itemBuffer = new ItemBuffer();
        itemBuffer.buffer = buffer;
        itemBuffer.timeDuration = buffer.duration;
        itemBuffer.numberOfChannels = buffer.numberOfChannels;
        itemBuffer.name = name;
        //itemBuffer.listItemMix = [];
        return itemBuffer;
    }
}
