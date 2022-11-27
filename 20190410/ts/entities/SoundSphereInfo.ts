class SoundSphereInfo {
    name:string
    version:string
    beta: boolean
    constructor(){
        this.name = "Soundphere"
        this.version = "1.4.1"
        this.beta = true
    }
    getVersion():string{
        return this.version;
    }
    getFullName(): string{
        return `${this.name} - ${this.version}`
    }
    getColorTitle(): string{
        return this.beta ? 'red' : 'black';
    }
}

