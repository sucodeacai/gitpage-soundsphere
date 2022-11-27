/**
 * 
 * @param {String} type Tipo do filtro
 * @param {String} name NOme do filtro a ser apresentado
 * @param {number} frequency frequencia que o filtro está trabalhando 
 * @param {number} Q  Q que o filtro está trabalhando
 * @param {number} gain O ganho
 * @param {number} gain Ordem de insercao
 */
function Filter (type, name, frequency, Q, gain, order,status ){
    this.type  = type;
    this.name = name;
    this.frequency = frequency;
    this.Q = Q;
    this.gain = gain;
    this.order = order;
    this.status = status;
}