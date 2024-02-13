class ServicioSolicitud{
    constructor(idServicioSolicitud, servicio, solicitud){
        this._idServicioSolicitud = idServicioSolicitud,
        this._idServicio = servicio,
        this._idSolicitud = solicitud
    }
    getIdServicioSolicitud(){
        return this._idServicioSolicitud;
    }
    setIdServicioSolicitud(idServicioSolicitud){
        this._idServicioSolicitud = idServicioSolicitud;
    }
    
    getServicio(){
        return this._idServicio;
    }
    setServicio(idServicio){
        this._idServicio = idServicio;
    }
    getIdSolicitud(){
        return this._idSolicitud;
    }
    setIdSolicitud(idSolicitud){
        this._idSolicitud = idSolicitud;
    }
}

module.exports = ServicioSolicitud;