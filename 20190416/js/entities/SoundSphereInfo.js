"use strict";
class SoundSphereInfo {
    constructor() {
        this.name = "SoundSphere";
        this.version = "1.4.4";
        this.change = [
            "1.4.1 -  Aplicação de alteração visual aos Itens de mixagem de acordo com o descritor semantico. Ajuste do translatte 0.5",
            "1.4.2 - Mudança das cores das amostras e Criação do campo JSONFileStructureVersion.",
            "1.4.3 - Mudanças nas opções de Volume.",
            "1.4.4 - Processar os itens de mixagem ao dar play e download apenas quando tiver alterações.",
            "1.4.4 - O pause agora ativa o Traker.",
            "1.4.4 - Correção  do titulo. "
        ];
        this.JSONFileStructureVersion = "1.4";
        this.beta = true;
    }
    getVersion() {
        return this.version;
    }
    getFullName() {
        return `${this.name} - ${this.version}`;
    }
    getColorTitle() {
        return this.beta ? 'red' : 'black';
    }
}
