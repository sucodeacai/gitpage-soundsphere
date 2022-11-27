var contId = 0;
var listNamesInvalid;
var controlColor = new ControlColor();

//Função para desativar o loading
function desativarLoading() {
    "use strict";
    console.log("chamou desativa");
    var divLoading = document.getElementById('divLoading');
    divLoading.setAttribute('class', 'ui inverted dimmer desactive');
    //Se tiver algum listNamesInvalid então ele carrega um modal avisando ao usuario sobre os arquivos nao carregados
    if (listNamesInvalid.length > 0) {
      console.log("desativar entro no if");
      console.log("lista invalid : "+listNamesInvalid);
        var contentInvalidNames = document.getElementById("contentInvalidNames");
        while (contentInvalidNames.firstChild) {
            contentInvalidNames.removeChild(contentInvalidNames.firstChild);
        }
        for (var i = 0; i < listNamesInvalid.length; i++) {
            var p = document.createElement('p');
            p.innerHTML = listNamesInvalid[i];
            contentInvalidNames.appendChild(p);
        }
        $('#modalInvalidFiles').modal({
            onHide: function() {
                console.log("close modal --------------");
                listNamesInvalid = [];
                contentInvalidNames.innerHTML = "";
            }
        }).modal('show');


    }
}









//Função responsavel por fazer o carregamento dos arquivos de audio



function handleFileSelect(evt) {
    "use strict";
    sequenciador.stop();
    listNamesInvalid = [];

    var files = [],
        divLoading = document.getElementById('divLoading'),
        i, f, reader, audio, result, bufferList = [], nameList=[],
        controlSoundIcon,
        contador = 0,
        listNames = [];
    controlSoundIcon = new ControlSoundIcon();
    if (navigator.userAgent.match(/Android/i)) {
        files = evt.target.files;
    } else {
        for (var i = 0; i < evt.target.files.length; i++) {
            console.log("verificando arquivo: " + evt.target.files[i].name);
            if (evt.target.files[i].type == "audio/wav" && !(controlColor.fileLoaded(evt.target.files[i].name))) {
                files.push(evt.target.files[i]);
            } else if (evt.target.files[i].type == "audio/wav") {
                console.log("arquivo repetido");
                listNamesInvalid.push(evt.target.files[i].name + ": -Arquivo já carregado/ File already loaded");
                console.log("invalid list: "+listNamesInvalid);
            } else {
                listNamesInvalid.push(evt.target.files[i].name + ": -Formanto inválido/ Invalid format");
            }
        }
    }
    if (files.length > 0) {
        divLoading.setAttribute('class', 'ui inverted dimmer active');
    } else {
        desativarLoading();
    }

    for (i = 0; i < files.length; i = i + 1) {
        listNames[i] = files[i].name;
    }
    console.log("list names fora da controlColor: " + listNames);
    controlColor.addList(listNames);
    var dif = controlColor.listFilesNamesLenght() - files.length;
    console.log("dif: " + dif);

    for (i = 0; i < files.length; i = i + 1) {
        f = files[i];
        reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(evt) {
                var positionBuffer = controlColor.getPosition(theFile.name) - dif;
                bufferList[positionBuffer] = evt.target.result;
                nameList[controlColor.getPosition(theFile.name) - dif] = theFile.name;
                contador = contador + 1;
                contId = contId + 1;
                if (contador == files.length) {
                    for (var j = 0; j < files.length; j++) {
                        controlSoundIcon.create((j + dif), files[j].type, controlColor.getName((j + dif)), controlColor.getColor((j + dif)));
                    }

                    sequenciador.loadBufferList(bufferList, nameList, desativarLoading);
                }
            };
        })(f);
        reader.readAsArrayBuffer(f);
    }

}


//Função para o carregamento dos arquivos para continuação caso o usuário
//decida utilizar o Local Storage
function handleFileSelectLS(evt) {
  "use strict";
  sequenciador.stop();
  var listNamesInvalid = [];

  var files = [],
    divLoading = document.getElementById('divLoading'),
    i, f, reader, audio, result, bufferList = [],
    nameList = [],
    controlSoundIcon,
    contador = 0,
    listNames = [];
  controlSoundIcon = new ControlSoundIcon();
  if (navigator.userAgent.match(/Android/i)) {
    files = evt.target.files;
  } else {
    for (var i = 0; i < evt.target.files.length; i++) {
      if (evt.target.files[i].type == "audio/wav" && (checkFileLoadedLS(evt.target.files[i].name))) {
        files.push(evt.target.files[i]);
      } else if (evt.target.files[i].type == "audio/wav") {
        listNamesInvalid.push(evt.target.files[i].name + ": - O arquivo não foi carregado pois não esta na lista.");
      } else {
        listNamesInvalid.push(evt.target.files[i].name + ": - Formanto inválido/ Invalid format");
      }
    }
  }

  //A lista de arquivos validos deve ser igual ao tamanho da listBuffer LS
  //se nao o sistema nao faz a leitura dos arquivos
  console.log("files.length" + files.length);
  if (checkBufferListLenghtLS() == files.length) {
    divLoading.setAttribute('class', 'ui inverted dimmer active');
    for (i = 0; i < files.length; i = i + 1) {
      listNames[i] = files[i].name;
    }
    controlColor.addList(listNames);
    var dif = controlColor.listFilesNamesLenght() - files.length;
    for (i = 0; i < files.length; i = i + 1) {
      f = files[i];
      reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(evt) {
          bufferList[controlColor.getPosition(theFile.name) - dif] = evt.target.result;
          nameList[controlColor.getPosition(theFile.name) - dif] = theFile.name;
          contador = contador + 1;
          //
          contId = contId + 1;
          if (contador == files.length) {
            for (var j = 0; j < files.length; j++) {
              controlSoundIcon.create((j + dif), files[j].type, controlColor.getName((j + dif)), controlColor.getColor((j + dif)));
            }
            sequenciador.loadBufferList(bufferList, nameList, desativarLoadingLSOK, listNamesInvalid);
            //  console.log('teste>' + controlSoundIcon.classSoundIcon);
          }
        };
      })(f);
      //
      reader.readAsArrayBuffer(f);
    }
  } else {
    listNamesInvalid.push("Não foram enviados todos os arquivos da lista.");
    desativarLoadingLSError(listNamesInvalid);
  }
}


//Função para o carregamento dos arquivos para continuação caso o usuário
//decida utilizar o JSON
function handleFileSelectAudioToJSON(evt) {
  "use strict";
  sequenciador.stop();
  var listNamesInvalid = [];

  var files = [],
    divLoading = document.getElementById('divLoading'),
    i, f, reader, audio, result, bufferList = [],
    nameList = [],
    controlSoundIcon,
    contador = 0,
    listNames = [];
  controlSoundIcon = new ControlSoundIcon();
  if (navigator.userAgent.match(/Android/i)) {
    files = evt.target.files;
  } else {
    for (var i = 0; i < evt.target.files.length; i++) {
      if (evt.target.files[i].type == "audio/wav" && (checkFileLoadedJSON(evt.target.files[i].name))) {
        files.push(evt.target.files[i]);
      } else if (evt.target.files[i].type == "audio/wav") {
        listNamesInvalid.push(evt.target.files[i].name + ": - O arquivo não foi carregado pois não esta na lista.");
      } else {
        listNamesInvalid.push(evt.target.files[i].name + ": - Formanto inválido/ Invalid format");
      }
    }
  }

  //A lista de arquivos validos deve ser igual ao tamanho da listBuffer LS
  //se nao o sistema nao faz a leitura dos arquivos
  console.log("files.length" + files.length);
  if (checkBufferListLenghtJSON() == files.length) {
    divLoading.setAttribute('class', 'ui inverted dimmer active');
    for (i = 0; i < files.length; i = i + 1) {
      listNames[i] = files[i].name;
    }
    controlColor.addList(listNames);
    var dif = controlColor.listFilesNamesLenght() - files.length;
    for (i = 0; i < files.length; i = i + 1) {
      f = files[i];
      reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(evt) {
          bufferList[controlColor.getPosition(theFile.name) - dif] = evt.target.result;
          nameList[controlColor.getPosition(theFile.name) - dif] = theFile.name;
          contador = contador + 1;
          //
          contId = contId + 1;
          if (contador == files.length) {
            for (var j = 0; j < files.length; j++) {
              controlSoundIcon.create((j + dif), files[j].type, controlColor.getName((j + dif)), controlColor.getColor((j + dif)));
            }
            sequenciador.loadBufferList(bufferList, nameList, desativarLoadingJSONOK, listNamesInvalid);
            //  codesativarLoadingLSErrornsole.log('teste>' + controlSoundIcon.classSoundIcon);
          }
        };
      })(f);
      //
      reader.readAsArrayBuffer(f);
    }
  } else {
    listNamesInvalid.push("Não foram enviados todos os arquivos da lista.");
    desativarLoadingJSONError(listNamesInvalid);
    console.log("aaaaaaaaaaa bbbbbbbbbbbb ccccccccccc: "+listNamesInvalid);
  }
}



//Desativa loading especifico para se o usuario optar por continuar a partir do
//local storage, caso não tenha enviado os arquivos solicitados
function desativarLoadingLSError(listNamesInvalid) {
  "use strict";
  console.log("aaaaaaaaaaaaaaaaaa: "+listNamesInvalid);
  console.log("chamou desativa");
  var divLoading = document.getElementById('divLoading');
  divLoading.setAttribute('class', 'ui inverted dimmer desactive');
  //Se tiver algum listNamesInvalid então ele carrega um modal avisando ao usuario sobre os arquivos nao carregados
  if (listNamesInvalid.length > 0) {

    var divMessageError = document.getElementById('messageErrorModalContinue');
    var divError = document.createElement('div');
    divError.setAttribute('class', 'ui error message');
    var icon = document.createElement('i');
    icon.setAttribute('class', 'close icon');
    var divHeader = document.createElement('div');
    divHeader.setAttribute('class', 'header');
    divHeader.innerHTML = "Atenção!";
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'list');
    for (var i = 0; i < listNamesInvalid.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = listNamesInvalid[i];
      ul.appendChild(li);
    }
    divError.appendChild(icon);
    divError.appendChild(divHeader);
    divError.appendChild(ul);
    divMessageError.innerHTML = "";
    divMessageError.appendChild(divError);
  }
}
//Desativa loading especifico para se o usuario optar por continuar a partir do
//JSON, caso não tenha enviado os arquivos solicitados
function desativarLoadingJSONError(listNamesInvalid) {
  "use strict";
  console.log("aaaaaaaaaaaaaaaaaa: "+listNamesInvalid);
  console.log("chamou desativa");

  console.log("chamou desativa");
  var divLoading = document.getElementById('divLoading');
  divLoading.setAttribute('class', 'ui inverted dimmer desactive');
  //Se tiver algum listNamesInvalid então ele carrega um modal avisando ao usuario sobre os arquivos nao carregados
  if (listNamesInvalid.length > 0) {

    var divMessageError = document.getElementById('mensageStep2JSON');
    var divError = document.createElement('div');
    divError.setAttribute('class', 'ui error message');
    var icon = document.createElement('i');
    icon.setAttribute('class', 'close icon');
    var divHeader = document.createElement('div');
    divHeader.setAttribute('class', 'header');
    divHeader.innerHTML = "Atenção!";
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'list');
    for (var i = 0; i < listNamesInvalid.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = listNamesInvalid[i];
      ul.appendChild(li);
    }
    divError.appendChild(icon);
    divError.appendChild(divHeader);
    divError.appendChild(ul);
    divMessageError.innerHTML = "";
    divMessageError.appendChild(divError);
  }
}
//Desativa loading especifico para se o usuario optar por continuar a partir do
//local storage, caso o usuario tenha enviado os arquivos solicitados
//e caso ele tenha enviado os arquivos solicitados e arquivos a mais
function desativarLoadingLSOK(listNamesInvalid) {
  "use strict";
  $('#modalOkLS').modal('show');
  var divLoading = document.getElementById('divLoading');
  divLoading.setAttribute('class', 'ui inverted dimmer desactive');
  //Se tiver algum listNamesInvalid então ele carrega um modal avisando ao usuario sobre os arquivos nao carregados
  if (listNamesInvalid.length > 0) {
    var divFather = document.getElementById('messageAttentionModalOkLS');
    var divMessageAT = document.createElement('div');
    divMessageAT.setAttribute('class', 'ui warning icon message');
    var icon = document.createElement('i');
    icon.setAttribute('class', 'warning sign icon');
    var divContent = document.createElement('div');
    divContent.setAttribute('class', 'content');
    var divHeader = document.createElement('div');
    divHeader.setAttribute('class', 'header');
    divHeader.innerHTML = "Atenção! Os seguintes itens não foram carregados pois:"
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'list');
    for (var i = 0; i < listNamesInvalid.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = listNamesInvalid[i];
      ul.appendChild(li);
    }
    divMessageAT.appendChild(icon);
    divMessageAT.appendChild(divContent);
    divContent.appendChild(divHeader);
    divContent.appendChild(ul);
    divFather.appendChild(divMessageAT);
  }
  //Simcroniza  o LS com o Soundsphere
  synchronizeSoundSphereLS();
}
//Desativa loading especifico para se o usuario optar por continuar a partir do
//json, caso o usuario tenha enviado os arquivos solicitados
//e caso ele tenha enviado os arquivos solicitados e arquivos a mais
function desativarLoadingJSONOK(listNamesInvalid) {
  "use strict";
  $('#modalOkLS').modal('show');
  var divLoading = document.getElementById('divLoading');
  divLoading.setAttribute('class', 'ui inverted dimmer desactive');
  //Se tiver algum listNamesInvalid então ele carrega um modal avisando ao usuario sobre os arquivos nao carregados
  if (listNamesInvalid.length > 0) {
    var divFather = document.getElementById('messageAttentionModalOkLS');
    var divMessageAT = document.createElement('div');
    divMessageAT.setAttribute('class', 'ui warning icon message');
    var icon = document.createElement('i');
    icon.setAttribute('class', 'warning sign icon');
    var divContent = document.createElement('div');
    divContent.setAttribute('class', 'content');
    var divHeader = document.createElement('div');
    divHeader.setAttribute('class', 'header');
    divHeader.innerHTML = "Atenção! Os seguintes itens não foram carregados pois:"
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'list');
    for (var i = 0; i < listNamesInvalid.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = listNamesInvalid[i];
      ul.appendChild(li);
    }
    divMessageAT.appendChild(icon);
    divMessageAT.appendChild(divContent);
    divContent.appendChild(divHeader);
    divContent.appendChild(ul);
    divFather.appendChild(divMessageAT);
  }
  //Simcroniza  o LS com o Soundsphere
  synchronizeSoundSphereJSON();
}


//Função para gerenciar o JSON file eniado pelo usuario
/// FOnte:  http://stackoverflow.com/questions/23344776/access-data-of-uploaded-json-file-using-javascript
function handleFileSelectJSON(evt) {
  var name = event.target.files[0].name;
  if (name.endsWith(".json")) {
    if (checkValidJSONFile()) {
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(event.target.files[0]);
    } else {
      mensagemJSON("O arquivo JSON não é valido.");
    }
  } else {
    mensagemJSON("O arquivo enviado não é do formato JSON");
  }
}

function onReaderLoad(event) {
  var allData = JSON.parse(event.target.result);
  allDataJSONFile = allData;
  var listFiles = document.getElementById('filesRequireJSON');
  var listName = getNameBuffersJSON();
  for (var i = 0; i < listName.length; i++) {
    var divColumn = document.createElement("div");
    divColumn.className = "column";
    var divUiBL = document.createElement("div");
    divUiBL.className = "ui bulleted list";
    var divItem = document.createElement("div");
    divItem.className = "item";
    var conteudoNovo = document.createTextNode(listName[i]);
    divItem.appendChild(conteudoNovo);
    divUiBL.appendChild(divItem);
    divColumn.appendChild(divUiBL);
    listFiles.appendChild(divColumn);
  }
    $('#modalStep2JSON').modal('show');

}
/////////////// fim

function mensagemJSON(msg) {
  var divMessageError = document.getElementById('mensageStep1JSON');
  var divError = document.createElement('div');
  divError.setAttribute('class', 'ui error message');
  var icon = document.createElement('i');
  icon.setAttribute('class', 'close icon');
  var divHeader = document.createElement('div');
  divHeader.setAttribute('class', 'header');
  divHeader.innerHTML = "Atenção!";
  var para = document.createElement('p');
  para.innerHTML = msg;
  divError.appendChild(icon);
  divError.appendChild(divHeader);
  divError.appendChild(para);
  divMessageError.innerHTML = "";
  divMessageError.appendChild(divError);
}
