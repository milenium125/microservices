const Usuario = require('./Usuario');
class Cliente extends Usuario{
    constructor(){
        super();
        this._idClient = undefined;
        this._stateClient = undefined;
        this._rolClient = undefined;
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

    toString(){
        return `{"id_persona":${this._idUser},
        "id_cliente":"${this._idClient}",
        "nombre":"${this._firstNameUser}",
        "apellido":"${this._lastNameUser}",
        "direccion":"${this._addressUser}",
        "telefono":"${this._phoneNumberUser}",
        "tipo_cliente":"${this._rolClient}",
        "email":"${this._emailUser}",
        "foto_perfil": ${this._pictureProfile}",
        "estado":${this._stateClient}
        }`;
    }
}

module.exports = Cliente;