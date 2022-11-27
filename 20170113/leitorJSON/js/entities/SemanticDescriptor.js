// Classe que armazena os descritores semanticos, cada descritor semantico tem um conjunto de filtros
function SemanticDescriptor(name,filters) {
    this.name =name;
    this._filters = filters;
    
       
}
//Quando não se passa os filtros como parametro o sistema gera os filtros padrões.
function generatorSemaitsDescriptors(){
    filtros = [];
    let  allpass = new Filter("allpass","All Pass",100,10,"",7,true)
    let  bandpass = new Filter("bandpass","Band Pass",120,20,"",6,true)
    let  lowPass = new Filter("lowPass","Low Pass",10,20,"",5,true)
    let  lowshelf = new Filter("lowshelf","Low Shelf",10,"",120,4,true)
    let  highshelf = new Filter("highshelf","High Shelf",110,"",120,3,true)
    let  peaking = new Filter("peaking","Peaking",140,120,1500,2,true)
    let  notch = new Filter("notch","Notch",180,120,"",1,false)

    filtros.push(lowPass,bandpass,lowshelf,highshelf,peaking,notch,allpass);
    descritorAbafado =new SemanticDescriptor('Abafado',filtros);
    filtros = [];
    lowPass = new Filter("lowPass","Low Pass",20,20,"",1,true)
    bandpass = new Filter("bandpass","Band Pass",210,20,"",2,true)
    lowshelf = new Filter("lowshelf","Low Shelf",240,"",20,3,true)
    highshelf = new Filter("highshelf","High Shelf",20,"",20,4,true)
    peaking = new Filter("peaking","Peaking",20,20,200,5,true)
    notch = new Filter("notch","Notch",230,20,"",6,true)
    allpass = new Filter("allpass","All Pass",20,20,"",7,true)
    filtros.push(lowPass,bandpass,lowshelf,highshelf,peaking,notch,allpass);
    descritorEstridente =new SemanticDescriptor('Estridente',filtros);
    return [descritorAbafado,descritorEstridente];
}
//Funcao que entrega os Filtros ja ordenados

//Funcao que troca de lugar
SemanticDescriptor.prototype.upFilter = function(id,callback) {
    console.log("-------------- no up entrou")

    this._filters[id-1].order -=1;
    this._filters[id-2].order +=1;
    this.orderFilters();
    callback();

}
SemanticDescriptor.prototype.downFilter = function(id,callback) {

    this._filters[id-1].order +=1;
    this._filters[id].order -=1;
    this.orderFilters();
    callback();
}
SemanticDescriptor.prototype.getLenght = function() {
    return this._filters.length;
}
SemanticDescriptor.prototype.getFilters = function() {
    this.orderFilters();
    return this._filters;
}
SemanticDescriptor.prototype.orderFilters = function() {
    this._filters.sort(function(a,b){
        return a.order -b.order;
    });

}