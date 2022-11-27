"use strict";
class SoundSphereInfo {
    constructor() {
        this.name = "Soundphere";
        this.version = "1.4.1";
        this.beta = true;
    }
    getVersion() {
        return this.version;
    }
    getFullName() {
        return `${this.name} - ${this.version}`;
    }
    getColorTitle() {
        return this.beta ? 'red' : 'black';
    }
}
