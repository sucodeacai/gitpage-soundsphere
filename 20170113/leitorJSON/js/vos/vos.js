var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var comands = [ 'play' , 'pause' , 'stop'];
var voiceComand;
var grammar = '#JSGF V1.0; grammar comands; public <comands> = ' + comands.join(' | ') + ' ;'
console.log("Gramar"+grammar);
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'pt-BR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

recognition.onresult = function(event) {
    var last = event.results.length - 1;
  var comand = event.results[last][0].transcript;
  comand = comand.toLowerCase();
  voiceComand = comand;
  console.log("Texto recebido: "+comand);
  switch (comand) {
      case "play":
          sequenciador.play();
          break;
      case "pause":
      sequenciador.pause()
          break;
      case "stop":
            sequenciador.stop();
          break;
      default:
            console.log("Comando não encontrado.");
  }
}
recognition.onspeechend = function() {
  recognition.stop();

}
recognition.onend = function() {
  recognition.stop();
    $('#buttonVoiceComand').toggleClass("active");
    M.toast({html: "Mensagem Recebida: "+voiceComand});
}
recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}
recognition.onerror = function(event) {
    $('#buttonVoiceComand').toggleClass("active");
  diagnostic.textContent = 'Atenção, mensagem de Erro: ' + event.error;
}
function startRecognition() {
  recognition.start();
  $('#buttonVoiceComand').toggleClass("active");
  console.log('Ready to receive a color command.');
}
