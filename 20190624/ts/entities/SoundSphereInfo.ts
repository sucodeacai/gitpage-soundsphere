class SoundSphereInfo {
    name:string
    version:string
    JSONFileStructureVersion:string
      change : string[]
    beta: boolean
    constructor(){
        this.name = "SoundSphere"
        this.version = "1.4.10"
        this.change = [
            "1.4.1 -  Aplicação de alteração visual aos Itens de mixagem de acordo com o descritor semantico. Ajuste do translatte 0.5"
            ,"1.4.2 - Mudança das cores das amostras e Criação do campo JSONFileStructureVersion."
            ,"1.4.3 - Mudanças nas opções de Volume."
            ,"1.4.4 - Processar os itens de mixagem ao dar play e download apenas quando tiver alterações."
            ,"1.4.4 - O pause agora ativa o Traker."
            ,"1.4.4 - Correção  do titulo. "
            ,"1.4.5 - Consistência entre cores de  uma versão para outra. "
            ,"1.4.5 - Pause não reseta o movimento do painel. "
            ,"1.4.6 - Correção do BUG que permitia ativação do Play/Pause quando se tem apenas itens excluidos. "
            ,"1.4.6 - Correção do BUG itens excluidos continuavam a serem executados na reprodução. "
            ,"1.4.6 - Indicação do operador semântico-timbrístico aplicado no evento usando abreviação tipo aeroporto, posicionamento vertical no início do evento. "
            ,"1.4.7 - Correção do BUG que alterava a posição da indicação do descritor de acordo com volume. "
            ,"1.4.7 - Mudança visual na indicação do descritor no painel. "
            ,"1.4.7 - Implementação da funcionalidade para permitir dar um título a composição. "
            ,"1.4.7 - Implementação do log dos itens do painel (histórico) . "
            ,"1.4.7 - Mudança da versão de leitura e gravação dos arquivos JSON. "
            ,"1.4.8 - Inclusão de informações no leitor JSON. "
            ,"1.4.8 - Correção do bug que intens excluidos continuavam a colidir ao alterar itens do painel. "
            ,"1.4.8 - Mudança de comportamento relativo a colisões de itens no painel. "
            ,"1.4.8 - Tempo máximo redudizo temporariamente para testar mensagens de erro. "
            ,"1.4.9 - Correção do BUG que alterava automaticamente filtros do mesmo tipo. "
            ,"1.4.9 - Mudança para que todos os Descritores sejam carregados com 40 filtros Peaking com Frequencias diferentes e Q 4.13. "
            ,"1.4.10 - Atualização das configurações dos descritores semanticos. "
            ,"1.4.11 - Alteração para permtir a definição das cores dos itens a partir da leitura de cores hexadecimais dos nomes dos arquivos. "
             
          ]
        this.JSONFileStructureVersion = "1.4.7"
        this.beta = true
    }
    getVersion():string{
        return this.version;
    }
    getFullName(): string{
        return `${this.name} - ${this.version}`
    }
    getColorTitle(): string{
        return this.beta ? 'red' : 'black';
    }
}

