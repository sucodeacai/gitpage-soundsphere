"use strict";
// Classe que armazena os descritores semanticos, cada descritor semantico tem um conjunto de filtros
class SemanticDescriptor {
    constructor(name, code, filters) {
        this.name = name;
        this._filters = filters;
        this.code = code;
    }
    upFilter(id, callback) {
        this._filters = swapPosition(this._filters, id, id - 1);
        callback();
    }
    downFilter(id, callback) {
        console.log("downFilter " + id);
        this._filters = swapPosition(this._filters, id, id + 1);
        callback();
    }
    addFilter(filter) {
        this._filters.push(filter);
    }
    removeFilter(id, callback) {
        console.log("Removendo: " + this._filters[id]);
        console.log(this._filters[id]);
        this._filters.splice(id, 1);
        callback();
    }
    getLenght() {
        return this._filters.length;
    }
    getFilters() {
        return this._filters;
    }
}
function swapPosition(arr, a, b) {
    arr[a] = arr.splice(b, 1, arr[a])[0];
    return arr;
}
function generatorSemaitsDescriptors() {
    let filtros = [];
    let lowPass = new Filter("lowpass", "Low Pass", 1100, 10, undefined, true);
    let highPass = new Filter("highpass", "High Pass", 1200, 20, undefined, true);
    let bandpass = new Filter("bandpass", "Band Pass", 1300, 30, undefined, true);
    let lowshelf = new Filter("lowshelf", "Low Shelf", 1400, undefined, 140, true);
    let highshelf = new Filter("highshelf", "High Shelf", 1500, undefined, 150, true);
    let peaking = new Filter("peaking", "Peaking", 1600, 160, 1600, true);
    let notch = new Filter("notch", "Notch", 1700, 70, undefined, true);
    let allpass = new Filter("allpass", "All Pass", 1800, 80, undefined, true);
    filtros.push(lowPass);
    let descPesado = new SemanticDescriptor('Pesado', 'PSD', filtros);
    filtros = [];
    filtros.push(highPass);
    let descLeve = new SemanticDescriptor('Leve', 'LV', filtros);
    filtros = [];
    filtros.push(bandpass);
    let descGrande = new SemanticDescriptor('Grande', 'GRD', filtros);
    filtros = [];
    filtros.push(lowshelf);
    let descPequeno = new SemanticDescriptor('Pequeno', 'PQN', filtros);
    filtros = [];
    filtros.push(highshelf);
    let descEscuro = new SemanticDescriptor('Escuro', 'ESR', filtros);
    filtros = [];
    filtros.push(peaking);
    let descBrilhante = new SemanticDescriptor('Brilhante', 'BRT', filtros);
    filtros = [];
    filtros.push(notch);
    let descQuente = new SemanticDescriptor('Quente', 'QNT', filtros);
    filtros = [];
    filtros.push(allpass);
    let descFrio = new SemanticDescriptor('Frio', 'FR', filtros);
    return [descPesado, descLeve, descGrande, descPequeno, descEscuro, descBrilhante, descQuente, descFrio];
}
