"use strict";
class PageLeitor {
    constructor(containerElement, titulo, soundSphereInfo, dao, tooltip) {
        this.containerElement = containerElement;
        this.titulo = titulo ? titulo : "";
        this.dao = dao;
        this.soundSphereInfo = soundSphereInfo;
        this.generateContent();
        this.setSettingsActions();
        this.showModalMessageInitial();
    }
    closeModal() {
        $('.ui.modal').modal('hide');
    }
    showData() {
        $('#content').css({ display: 'block' });
        this.showDataValues();
    }
    showDataValues() {
        console.log("show data values");
        let dadosAmostrasDiv = document.getElementById('dadosAmostras');
        let dadosItensDiv = document.getElementById('dadosItens');
        let dadosMixagemDiv = document.getElementById('dadosMixagem');
        var listaOrdenada = [];
        this.dao.listItemBuffer.forEach(element => {
            element.amount = 0;
        });
        for (var i = 0; i < this.dao.listItemMixPanel.length; i++) {
            if (this.dao.listItemMixPanel[i]) {
                for (var j = 0; j < this.dao.listItemMixPanel[i].length; j++) {
                    var itemMixPanel = new ItemMixPanel();
                    itemMixPanel.id = this.dao.listItemMixPanel[i][j].id;
                    itemMixPanel.idBuffer = this.dao.listItemMixPanel[i][j].idBuffer;
                    itemMixPanel.startTime = this.dao.listItemMixPanel[i][j].startTime;
                    itemMixPanel.endTime = this.dao.listItemMixPanel[i][j].endTime;
                    itemMixPanel.solo = Boolean(this.dao.listItemMixPanel[i][j].solo);
                    itemMixPanel.setVolume(this.dao.listItemMixPanel[i][j].getVolume());
                    itemMixPanel.color = this.dao.listItemMixPanel[i][j].color;
                    itemMixPanel.linha = i + 1;
                    if (this.dao.listItemMixPanel[i][j].getidSemanticDescriptor()) {
                        itemMixPanel.nameDescritor = (this.dao.getNameSemanticDescriptor(this.dao.listItemMixPanel[i][j].getidSemanticDescriptor()));
                    }
                    else {
                        itemMixPanel.nameDescritor = "nenhum";
                    }
                    itemMixPanel.x = this.dao.listItemMixPanel[i][j].x;
                    itemMixPanel.excluded = Boolean(this.dao.listItemMixPanel[i][j].excluded);
                    itemMixPanel.y = this.dao.listItemMixPanel[i][j].y;
                    itemMixPanel.seconds = this.dao.listItemMixPanel[i][j].seconds;
                    itemMixPanel.width = this.dao.listItemMixPanel[i][j].width;
                    itemMixPanel.height = this.dao.listItemMixPanel[i][j].height;
                    itemMixPanel.size = this.dao.listItemMixPanel[i][j].size;
                    itemMixPanel.style = this.dao.listItemMixPanel[i][j].style;
                    listaOrdenada.push(itemMixPanel);
                }
            }
        }
        listaOrdenada.sort(function (a, b) {
            return a.id - b.id;
        });
        let amostrasUtilizadas = [];
        amostrasUtilizadas[0] = listaOrdenada[0].idBuffer;
        listaOrdenada.forEach(element => {
            this.dao.listItemBuffer[element.idBuffer].amount += 1;
            var insere = true;
            for (let index = 0; index < amostrasUtilizadas.length; index++) {
                if (amostrasUtilizadas[index] == element.idBuffer) {
                    insere = false;
                }
            }
            if (insere) {
                amostrasUtilizadas.push(element.idBuffer);
            }
        });
        var dadosMixagem = `
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Quantidade de Amostras Disponiveis</th>
        <th>Quantidade de Amostras Diferentes Utilizadas</th>
        <th>Quantidade de Itens de Mixagens Inseridos</th>
   
     
      </tr>
    </thead>
    <tbody>
    `;
        var dadosAmostras = `
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Tempo da Amostra</th>
        <th>Número de Canais</th>
        <th>Quantidade de Vezes Utilizado</th>
      </tr>
    </thead>
    <tbody>
    `;
        var dadosItens = `
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Identificador</th>
        <th>Amostra</th>
        <th>Inicio</th>
        <th>Fim</th>
        <th>Solo/Mute</th>
        <th>Excluida</th>
        <th>Volume</th>
        <th>Linha</th>
        <th>Cor</th>
        <th>Descritor</th>
      </tr>
    </thead>
    <tbody>
     
    `;
        this.dao.listItemBuffer.forEach(element => {
            dadosAmostras += `
      <tr>
      <td>${element.name}</td>
      <td>${element.timeDuration}</td>
      <td>${element.numberOfChannels}</td>
      <td>${element.amount}</td>
      </tr>`;
        });
        dadosMixagem += `
      <tr>
      <td>${this.dao.listItemBuffer.length}</td>
      <td>${amostrasUtilizadas.length}</td>
      <td>${listaOrdenada.length}</td>
      
  
      </tr>`;
        listaOrdenada.forEach(element => {
            dadosItens += `
      <tr>
      <td>${element.id}</td>
      <td>${this.dao.listItemBuffer[element.idBuffer].name}</td>
      <td>${element.startTime}</td>
      <td>${element.endTime}</td>
      <td>${element.solo ? `Solo` : `Mute`}</td>
      <td>${element.excluded ? `sim` : `não`}</td>
      <td>${element.getVolume()}</td>
      <td>${element.linha}</td>
      <td style="color:${element.color}">${element.color}</td>
      <td>${element.nameDescritor}</td>
      </tr>`;
        });
        dadosAmostras += "</tbody></table>";
        dadosItens += "</tbody></table>";
        dadosMixagem += "</tbody></table>";
        dadosAmostrasDiv.innerHTML = dadosAmostras;
        dadosItensDiv.innerHTML = dadosItens;
        dadosMixagemDiv.innerHTML = dadosMixagem;
    }
    setSettingsActions() {
        $('#buttonIniciar').on('click', (e) => {
            this.closeModal();
            $('#step1').modal({ closable: false }).modal('setting', 'transition', 'horizontal flip').modal("show");
        });
    }
    generateContent() {
        this.generateContentofModalMessageInitial();
        this.generateContentofModalStep1();
        this.generateContentofData();
    }
    generateContentofData() {
        let conteudoHTML = `
    <h2 class="ui header centered">
      <div id="titulo">
        <font color="red">
         ${this.soundSphereInfo.getFullName()} - Leitor JSON
        </font>
      </div>
    </h2>
    <h1>Dados das amostras</h1>
    <div id="dadosAmostras"></div>
    <h1>Dados dos Itens de Mixagem</h1>
    <div id="dadosItens"></div>
    <h1>Dados Gerais</h1>
    <div id="dadosMixagem"></div>
    `;
        $('#content').html(conteudoHTML);
    }
    generateContentofModalStep1() {
        let conteudoHTML = `
    <div class="ui ordered top attached steps">
      <div class="active step">
        <div class="content">
          <div class="title">JSON</div>
        </div>
      </div>
 
      <div class=" step">
        <div class="content">
          <div class="title">Informações</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div id="mensageStep1JSON"></div>
      <div> Selecione o arquivo JSON gerado pelo SoundSphere que você deseja analisar.</div>
    </div>
    <div class="actions">

      <div onclick="fileJSON.click()" class="ui green button">Selecionar</div>
    </div>
  </div>
  <div id="modalStep2JSON" class="ui small third coupled modal transition">
    <div class="ui ordered top attached steps">
      <div class="completed step">
        <div class="content">
          <div class="title">JSON</div>
        </div>
      </div>

      <div class=" step">
        <div class="content">
          <div class="title">Informações</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div id="mensageStep2JSON"> </div>
      <p id="fileName">Você deve enviar as seguintes amostras de audio: </p>
      <div id="filesRequireJSON" class="ui two column grid"></div>

    </div>
    <div class="actions">

      <div class="ui red button">Cancelar</div>
      <div onclick="filesAudioToJson.click()" class="ui green button">Selecionar</div>
    </div>
`;
        $('#step1').html(conteudoHTML);
    }
    generateContentofModalMessageInitial() {
        let conteudoHTML = `
    <div class="header">
    Bem vindo! Ao leitor JSON do SoundSphere ${this.soundSphereInfo.getVersion()}
  </div>
  <div id="mensagem" class="content">
    <div class="feature alternate ui stripe vertical segment">
      <div class="ui one column center aligned divided relaxed stackable grid container">
        <div class="row">
          <div class="column">

            <p></p>
            <div id="buttonIniciar" class="ui green large button">Iniciar</div>
          </div>
         </div>
      </div>
    </div>
  </div>
`;
        $('#messageInitial').html(conteudoHTML);
    }
    showModalMessageInitial() {
        $('#messageInitial').modal({ closable: false }).modal('setting', 'transition', 'horizontal flip').modal("show");
    }
    showMessageErrorJson(mensagem) {
        const message = `
    <div class="ui error message">
   
      <div class="header">
        Alguns problemas foram encontrados na submissão:
      </div>
      <ul class="list">
        <li>${mensagem}</li>

      </ul>
    </div>
    `;
        $('#mensageStep1JSON').html(message);
    }
}
