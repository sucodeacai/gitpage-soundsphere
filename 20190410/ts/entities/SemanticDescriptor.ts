// Classe que armazena os descritores semanticos, cada descritor semantico tem um conjunto de filtros
class SemanticDescriptor {
    name: string
    _filters: Filter[]
    constructor(name: string, filters: Array<Filter>) {
        this.name = name
        this._filters = filters
    }
    upFilter(id: number, callback: Function): void {

        this._filters = swapPosition(this._filters, id, id-1)
        callback();

    }
    downFilter(id: number, callback: Function): void {
        console.log("downFilter " + id);
        this._filters = swapPosition(this._filters, id, id + 1);
        callback();
    }
    addFilter(filter:Filter){
        this._filters.push(filter);

    }

    removeFilter(id: number, callback: Function): void {
        console.log("Removendo: " + this._filters[id]);
        console.log(this._filters[id]);
        this._filters.splice(id, 1);
        callback();
    }
    getLenght(): number {
        return this._filters.length;
    }
    getFilters(): Array<Filter> {

        return this._filters;
    }
    // orderFilters(): void {
    //     this._filters.sort(function (a, b) {
    //         return a.order - b.order;
    //     });
    // }
    // move(array: Filter[], oldIndex: number, positionChange: number): Array<Filter> {
      
    //     if (oldIndex > -1) {
    //         var newIndex = (oldIndex + positionChange);

    //         if (newIndex < 0) {
    //             newIndex = 0
    //         } else if (newIndex >= array.length) {
    //             newIndex = array.length
    //         }

    //         var arrayClone = array.slice();
    //         arrayClone.splice(oldIndex, 1);
    //         arrayClone.splice(newIndex, 0, array[oldIndex]);

    //         return arrayClone
    //     }
    //     return array

    // }
    // move(arr: Array<Filter>, old_index: number, new_index: number): Array<Filter> {
    //     while (old_index < 0) {
    //         old_index += arr.length;
    //     }
    //     while (new_index < 0) {
    //         new_index += arr.length;
    //     }
    //     if (new_index >= arr.length) {
    //         var k = new_index - arr.length;
    //         while ((k--) + 1) {
    //             arr.push(undefined);
    //         }
    //     }
    //     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //     return arr;
    // }

}


function swapPosition(arr:Filter[],a:number, b:number){
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
    let descPesado = new SemanticDescriptor('Pesado', filtros);
    
    filtros = [];

    filtros.push(highPass);
    let descLeve = new SemanticDescriptor('Leve', filtros);
    
    filtros = [];

    filtros.push(bandpass);
    let descGrande = new SemanticDescriptor('Grande', filtros);
    
    filtros = [];

    filtros.push(lowshelf);
    let descPequeno = new SemanticDescriptor('Pequeno', filtros);
    
    filtros = [];

    filtros.push(highshelf);
    let descEscuro = new SemanticDescriptor('Escuro', filtros);
    
    filtros = [];

    filtros.push( peaking);
    let descBrilhante = new SemanticDescriptor('Brilhante', filtros);
    
    filtros = [];

    filtros.push( notch);
    let descQuente = new SemanticDescriptor('Quente', filtros);
    
    filtros = [];

    filtros.push( allpass);
    let descFrio = new SemanticDescriptor('Frio', filtros);



    return [descPesado, descLeve,descGrande,descPequeno,descEscuro,descBrilhante,descQuente,descFrio];
}
