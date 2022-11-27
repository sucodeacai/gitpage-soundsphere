"use strict";
class FileLeitorJson extends FileJson {
    constructor(sequenciador, dao, tooltip, simplePage) {
        super(sequenciador, dao);
        this.simplePage = simplePage;
    }
    showMessageErrorJson(mensagem) {
        this.simplePage.showMessageErrorJson(mensagem);
    }
    onReaderJson(evt) {
        let soundSphereDB = JSON.parse(evt.target.result);
        console.log(soundSphereDB);
        if (soundSphereDB.soundSphereInfo != undefined && soundSphereDB.soundSphereInfo.version == this.dao.soundSphereInfo.version) {
            this.dao.synchronizeSoundSphereDB(soundSphereDB);
            this.simplePage.closeModal();
            this.simplePage.showData();
        }
        else {
            this.simplePage.showMessageErrorJson(`Aquivo incompatível carregue arquivos gerados pela versão SoundSphere - ${this.dao.soundSphereInfo.version}.`);
        }
    }
}
