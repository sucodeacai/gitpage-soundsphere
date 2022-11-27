function MyModal(divModal, titulo, attributes) {
  this.divModal = divModal;
  this.attributes = attributes ? attributes : [];
  this.titulo = titulo ? titulo : "Opções Informe";
  this.previousFilterSelected = 0;

}
MyModal.prototype.setAttributesFilter = function () {
  let filter = semanticDescriptors[this.filterSelected].getFilters();
  filter.forEach(element => {
    if (element.frequency) {
      element.frequency = $(`#frequency${element.type}`).val()
    }
    if (element.Q) {
      element.Q = $(`#Q${element.type}`).val()
    }
    if (element.gain) {
      element.gain = $(`#gain${element.type}`).val()
    }
    element.status = $(`#divCheck${element.type}`).hasClass("checked")
  });

}
/**
 * Funcao responsavel por gerar as opcoes e atributos especificos do motal Filtros
 * @param {*} positionFilter posicao que o filtro dece inciar
 */
MyModal.prototype.nextItemBuffer = function () {
  if (this.controlSelectedItemBuffer < sequenciador.bufferList.length) {
    this.controlSelectedItemBuffer += 1;
  } else {
    this.controlSelectedItemBuffer = 0;
  }
}
MyModal.prototype.generateOptionsFilter = function () {
  this.generateAttributes = this.generateAttributesFilter();
  this.generateSettings = this.generateSettingsFilter();
  this.generateActions = this.generateActionsFilter();
  this.controlSelectedItemBuffer = 0;
  this.filterSelected = 0;
}
MyModal.prototype.generateActionsFilter = function () {
  return function () {
    console.log('  sequenciador.bufferList');
    console.log(sequenciador.bufferList);
    console.log(sequenciador.bufferList.length);
    const conteudo = `
    ${sequenciador.bufferList.length == 0 ?
        "" :
        `<button onmouseout="sequenciador.stopOneSound()"  onmouseover=" myModal.setAttributesFilter(); sequenciador.playOneSound(${this.controlSelectedItemBuffer}, function (){}, semanticDescriptors[myModal.filterSelected].getFilters());" class="ui green right labeled icon button">
   
        Tocar ${sequenciador.bufferList[this.controlSelectedItemBuffer].name}
         </button>
        <button onclick=" myModal.setAttributesFilter(); myModal.nextItemBuffer(); myModal.render()" class="ui yellow right labeled icon button">
          <i class="chevron right icon"></i>
          Mudar Amostra
        </button>`}
      <button onclick=" myModal.setAttributesFilter(); setShowErorMessageToast();  files.click();" class="ui blue right labeled icon button">
      <i class="upload icon"></i>
      Upload Wav
   </button>`;
    return conteudo;
  };
}
MyModal.prototype.generateSettingsFilter = function () {
  return function () {
    $('.button.positive').click(function () {
      $(this).closest('[data-id]').addClass("subir");
      setTimeout(() => {
        myModal.setAttributesFilter();
        semanticDescriptors[myModal.filterSelected].upFilter($(this).data("value"), () => { myModal.render() });
      }, 500);
    });
    $('.button.down').click(function () {
      $(this).closest('[data-id]').addClass("descer");
      setTimeout(() => {
        myModal.setAttributesFilter();
        semanticDescriptors[myModal.filterSelected].downFilter($(this).data("value"), () => { myModal.render() });
      }, 500);
    });
    $('.ui.checkbox').checkbox({
      beforeChecked: function () {
        $("label[for='" + $(this).attr('id') + "']").html("Ativado");
        $(`#frequency${$(this).data("type")}`).prop( "disabled", false );
        $(`#Q${$(this).data("type")}`).prop( "disabled", false );
        $(`#gain${$(this).data("type")}`).prop( "disabled", false );
      },
      beforeUnchecked: function () {
        $("label[for='" + $(this).attr('id') + "']").html("Desativado");
        $(`#frequency${$(this).data("type")}`).prop( "disabled", true );
        $(`#Q${$(this).data("type")}`).prop( "disabled", true );
        $(`#gain${$(this).data("type")}`).prop( "disabled", true );
      }
    });
    $("#select-filter").on('focus', function () {
      myModal.previousFilterSelected = this.value;
    }).change(function () {
      myModal.setAttributesFilter(myModal.previousFilterSelected);
      myModal.filterSelected = this.value;
      myModal.render();
      myModal.previousFilterSelected = this.value;
    });
  }
}
/**
 * 
 * @param {*} positionFilter Posicao que o filtro deve ser iniciado
 */
MyModal.prototype.showErroMessage = function (texto) {
  console.log('Chamou o erro');
  console.log(texto);
  const modais = document.querySelector("#mensagens");
  const modal = document.createElement("div");
  modal.innerHTML = texto;
  modal.classList.add("modalClass");
  modais.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("remover");
    setTimeout(() => {
      modais.removeChild(modal);

    }, 2000);
  }, 2000);
}
MyModal.prototype.generateAttributesFilter = function () {
  return function () {
    let filter = semanticDescriptors[this.filterSelected].getFilters();
    console.log(filter);
    let conteudo = `
    <div class="three fields">   
      <div class="field"></div>
      <div class="field">
        <label><h3>Descritores</h3></label>
        <div class="ui item">
          <select id="select-filter" class="ui fluid  dropdown">
       `;
    semanticDescriptors.forEach((element, index) => {
      if (this.filterSelected == index) {
        conteudo += `<option selected="selected"  value="${index}">${element.name}</option>`
      } else {
        conteudo += `<option  value="${index}">${element.name}</option>`
      }
    });
    conteudo += `
          </select>
        </div>
      </div>
    </div>`;
    filter.forEach(element => {
     
      conteudo += `
      <div class="contentFilter ui stacked   segment"  id="container${element.type}" data-id="container${element.type}">
      
        <div style="margin-bottom:1px"  class="ui  header">${element.name}
      
          <div class="mini ui buttons">
  
          <button data-value="${element.order}" class="mini ui positive ${element.order == 1 ?"disabled" : ""} button">
          <i class="angle up icon"></i>
          </button>
        
        <div class="or" data-text="ou"></div>
        
     
          <button data-value="${element.order}"  class="mini ui orange ${element.order == semanticDescriptors[this.filterSelected].getLenght() == 1 ?"disabled" : ""}  button down">
          <i class="angle down icon"></i>
          </button>
        
          </div>
          <div class="ui labeled input field">
            <div data-type="${element.type}" id="divCheck${element.type}" class="ui toggle checkbox ${element.status == true ? `checked` : ""}">
              <input data-type="${element.type}" id="status${element.type}"  ${element.status == true ? `checked="checked"` : ""}  type="checkbox">
              <label class="labelCheck" for="status${element.type}"> ${element.status == true ? `ativado` : "desativado"}
              </label>
            </div>
          </div>
        </div>
      <div class="three fields">
        ${element.frequency ?
          `<div class="field">
          <label>Frequency</label>
          <input id="frequency${element.type}" value="${element.frequency}" type="number" min="1" max="24000"  ${element.status == true ? "" : "disabled"}/>
        </div>`: ""
        }
        ${element.Q ?
          `<div class="field">
          <label>Q</label>
          <input id="Q${element.type}" value="${element.Q}" type="number" min="1" max="24000" ${element.status == true ? "" : "disabled"} />
        </div>`: ""
        }
        ${element.gain ?
          `<div class="field">
          <label>Ganho</label>
          <input id="gain${element.type}" value="${element.gain}" type="number" min="1" max="24000" ${element.status == true ? "" : "disabled"} />
        </div>`: ""
        }
      </div>

    </div>


    
    `
    });
    return conteudo;
  }
}
MyModal.prototype.generateAttributes = function () {
  return 'Informe os atribultos';
}
MyModal.prototype.generateActions = function () {
  return 'Informe as actions';
}
MyModal.prototype.generateSettings = function () {
  return console.log('Nenhuma configuracao especifica passada');
}
MyModal.prototype.render = function () {
  // console.log(this.conteudoModal);

  this.conteudoModal =
    `<div class="header">${this.titulo}</div>
<div class="content aparecer" id="corpoModal">
  <div onsubmit="return false;" class="ui form" novalidate id="formOptions">
    <div class="ui error message"></div>
    <div class="ui form">`+ this.generateAttributes() + `
    </div>
  </div>
</div>
</div>

<div class="actions">
  `+ this.generateActions() + `

</div>

`;
  this.divModal.html(this.conteudoModal);
  this.divModal.modal('setting', {
    autofocus: false
  }).modal('show');

  this.generateSettings();

}
