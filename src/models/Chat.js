

class Chat{
    constructor(){
        this._idChat = undefined;
        this._idTrabajador = undefined;
        this._idEmpleado = undefined;
        this.idSolicitud = undefined;
        this._fechaInicio = undefined;
        this._fechaFinal = undefined;
        this._estadoChat = undefined;
    }
    
    getIdChat(){
        return this._idChat;
    }
    setIdChat(id){
        this._idChat = id;
    }

    getIdEmpleado(){
        return this._idEmpleado;
    }
    setIdEmpleado(id){
        this._idEmpleado = id;
    }

    getIdTrabajador(){
        return this._idTrabajador;
    }
    setIdTrabajador(id){
        this._idTrabajador = id;
    }
    
    getIdSolicitud(){
        return this._idSolicitud;
    }
    setIdSolicitud(id){
        this._idSolicitud = id;
    }

    getFechaInicio(){
        return this._fechaInicio;
    }
    setFechaInicio(id){
        this._fechaInicio = id;
    }

    getFechaFinal(){
        return this._fechaFinal;
    }
    setFechaFinal(id){
        this._fechaFinal = id;
    }

    getEstadoChat(){
        return this._estadoChat;
    }
    setEstadoChat(id){
        this._estadoChat = id;
    }

}

module.exports = Chat;