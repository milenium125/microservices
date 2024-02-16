class ServicioTrabajador{
    constructor(idServicioTrabajador, servicio, precio, trabajador){
        this._idServicioTrabajador = idServicioTrabajador,
        this._idServicio = servicio,
        this._precio = precio,
        this._idTrabajador = trabajador
    }
    getIdServicioTrabajador(){
        return this._idServicioSolicitud;
    }
    setIdServicioTrabajador(idServicioTrabajador){
        this._idServicioTrabajador = idServicioTrabajador;
    }
    
    getServicio(){
        return this._idServicio;
    }
    setServicio(idServicio){
        this._idServicio = idServicio;
    }

    getPrecio(){
        return this._precio;
    }
    setPrecio(precio){
        this._precio = precio;
    }

    getIdTrabajador(){
        return this._idTrabajador;
    }
    setIdTrabajador(idTrabajador){
        this._idTrabajador = idTrabajador;
    }
}

module.exports = ServicioTrabajador;