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
        console.log("AddFilter");
        console.log(this._filters);
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
function getFiltersStandard() {
    let filtros = [];
    const qStantard = 4.13;
    let frequencias = [20, 50, 83, 120, 161, 208, 259, 318, 383, 455, 537, 628, 729, 843, 971, 1114, 1273, 1452, 1652, 1875, 2126, 2406, 2719, 3070, 3462, 3901, 4392, 4941, 5556, 6244, 7014, 7875, 8839, 9917, 11124, 12474, 13984, 15675, 17566, 19682];
    frequencias.forEach(element => {
        let filtro = new Filter("peaking", "Peaking", element, qStantard, 0, true);
        filtros.push(filtro);
    });
    return filtros;
}
function generatorSemaitsDescriptors() {
    // let filtros = [];
    // let lowPass = new Filter("lowpass", "Low Pass", 1100, 10, undefined, true);
    // let highPass = new Filter("highpass", "High Pass", 1200, 20, undefined, true);
    // let bandpass = new Filter("bandpass", "Band Pass", 1300, 30, undefined, true);
    // let lowshelf = new Filter("lowshelf", "Low Shelf", 1400, undefined, 140, true);
    // let highshelf = new Filter("highshelf", "High Shelf", 1500, undefined, 150, true);
    // let peaking = new Filter("peaking", "Peaking", 1600, 160, 1600, true);
    // let notch = new Filter("notch", "Notch", 1700, 70, undefined, true);
    // let allpass = new Filter("allpass", "All Pass", 1800, 80, undefined, true);
    // filtros.push(lowPass);
    let descPesado = new SemanticDescriptor('Pesado', 'PSD', getFiltersStandard());
    // filtros = [];
    // filtros.push(highPass);
    let descLeve = new SemanticDescriptor('Leve', 'LV', getFiltersStandard());
    // filtros = [];
    // filtros.push(bandpass);
    let descGrande = new SemanticDescriptor('Grande', 'GRD', getFiltersStandard());
    // filtros = [];
    // filtros.push(lowshelf);
    let descPequeno = new SemanticDescriptor('Pequeno', 'PQN', getFiltersStandard());
    // filtros = [];
    // filtros.push(highshelf);
    let descEscuro = new SemanticDescriptor('Escuro', 'ESR', getFiltersStandard());
    // filtros = [];
    // filtros.push( peaking);
    let descBrilhante = new SemanticDescriptor('Brilhante', 'BRT', getFiltersStandard());
    // filtros = [];
    // filtros.push( notch);
    let descQuente = new SemanticDescriptor('Quente', 'QNT', getFiltersStandard());
    // filtros = [];
    // filtros.push( allpass);
    let descFrio = new SemanticDescriptor('Frio', 'FR', getFiltersStandard());
    return [descPesado, descLeve, descGrande, descPequeno, descEscuro, descBrilhante, descQuente, descFrio];
}
