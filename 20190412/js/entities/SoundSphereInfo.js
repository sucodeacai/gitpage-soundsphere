"use strict";
class SoundSphereInfo {
    constructor() {
        this.name = "Soundphere";
        this.version = "1.4.3";
        this.change = [
            "1.4.1 -  Aplicação de alteração visual aos Itens de mixagem de acordo com o descritor semantico. Ajuste do translatte 0.5",
            "1.4.2 - Mudança das cores das amostras e Criação do campo JSONFileStructureVersion.",
            "1.4.3 - Mudanças nas opções de Volume."
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
