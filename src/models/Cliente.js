const Usuario = require('./Usuario');
class Cliente extends Usuario{
    constructor(){
        super();
        this._idClient = undefined,
        this._stateClient = undefined,
        this._rolClient = undefined
    }

    getIdClient(){
        return this._idClient;
    }
    setIdClient(idClient){
        this._idClient = idClient;
    }

    getStateClient(){
        return this._stateClient;
    }
    setStateClient(stateClient){
        this._stateClient = stateClient;
    }

    getRolClient(){
        return this._rolClient;
    }
    setRolClient(rolClient){
        this._rolClient = rolClient;
    }
}

module.exports = Cliente;