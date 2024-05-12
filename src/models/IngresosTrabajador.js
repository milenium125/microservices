class IngresoTrabajador{
    constructor(){
        this._idIngreso = undefined;
        this._idTrabajador = undefined;
        this._idOrden = undefined;
        this.idPago = undefined;
        this._total= undefined;
        this._comision = undefined;
        this._totalIngreso = undefined;
        this._fecha = undefined;
        this._idEstado = undefined;
    }
    
    //Getters y Setters
    getIdIngreso(){
        return this._idIngreso;
    }
    setIdIngreso(id){
        this._idIngreso = id;
    }

    getIdTrabajador(){
        return this._idTrabajador;
    }
    setIdTrabajador(id){
        this._idTrabajador = id;
    }
    
    getIdOrden(){
        return this._idOrden;
    }
    setIdOrden(id){
        this._idOrden = id;
    }

    getIdPago(){
        return this._idPago;
    }
    setIdPago(id){
        this._idPago = id;
    }

    getTotal(){
        return this._total;
    }
    setTotal(id){
        this._total = id;
    }

    getTotalIngreso(){
        return this._totalIngreso;
    }
    setTotalIngreso(id){
        this._totalIngreso = id;
    }

    getFecha(){
        return this._fechaFinal;
    }
    setFecha(id){
        this._fecha = id;
    }

    getIdEstado(){
        return this._idEstado;
    }
    setIdEstado(id){
        this._idEstado = id;
    }

    //Metodo toString

}

module.exports = IngresoTrabajador;