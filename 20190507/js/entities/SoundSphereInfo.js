"use strict";
class SoundSphereInfo {
    constructor() {
        this.name = "SoundSphere";
        this.version = "1.4.7";
        this.change = [
            "1.4.1 -  Aplicação de alteração visual aos Itens de mixagem de acordo com o descritor semantico. Ajuste do translatte 0.5",
            "1.4.2 - Mudança das cores das amostras e Criação do campo JSONFileStructureVersion.",
            "1.4.3 - Mudanças nas opções de Volume.",
            "1.4.4 - Processar os itens de mixagem ao dar play e download apenas quando tiver alterações.",
            "1.4.4 - O pause agora ativa o Traker.",
            "1.4.4 - Correção  do titulo. ",
            "1.4.5 - Consistência entre cores de  uma versão para outra. ",
            "1.4.5 - Pause não reseta o movimento do painel. ",
            "1.4.6 - Correção do BUG que permitia ativação do Play/Pause quando se tem apenas itens excluidos. ",
            "1.4.6 - Correção do BUG itens excluidos continuavam a serem executados na reprodução. ",
            "1.4.6 - Indicação do operador semântico-timbrístico aplicado no evento usando abreviação tipo aeroporto, posicionamento vertical no início do evento. ",
            "1.4.7 - Correção do BUG que alterava a posição da indicação do descritor de acordo com volume. ",
            "1.4.7 - Mudança visual na indicação do descritor no painel. ",
            "1.4.7 - Implementação da funcionalidade para permitir dar um título a composição. ",
            "1.4.7 - Implementação do log dos itens do painel (histórico) . ",
            "1.4.7 - Mudança da versão de leitura e gravação dos arquivos JSON. "
        ];
        this.JSONFileStructureVersion = "1.4.7";
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
