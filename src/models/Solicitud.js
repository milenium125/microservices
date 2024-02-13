class Solicitud{
    constructor(idRequest, description, dateStart, dateEnd, totalRequest, payment, employee, client, stateRequest, idServicio){
        this._idRequest = idRequest,
        this._idServicio = idServicio,
        this._description = description,
        this._dateStart = dateStart,
        this._dateEnd = dateEnd,
        this._totalRequest = totalRequest,
        this._payment = payment,
        this._employee = employee,
        this._client = client,
        this._stateRequest = stateRequest
    }

    getIdRequest(){
        return this._idRequest;
    }
    setIdRequest(idRequest){
        this._idRequest = idRequest;
    }

    getIdServicio(){
        return this._idServicio;
    }
    setIdServicio(idServicio){
        this._idServicio = idServicio;
    }

    getDescription(){
        return this._description;
    }
    setDescription(description){
        this._description = description;
    }

    getDateStart(){
        return this._dateStart;
    }
    setDateStart(dateStart){
        this._dateStart = dateStart;
    }

    getDateEnd(){
        return this._dateEnd;
    }
    setDateEnd(dateEnd){
        this._dateEnd = dateEnd;
    }

    getTotalRequest(){
        return this._totalRequest;
    }
    setTotalRequest(totalRequest){
        this._totalRequest = totalRequest;
    }

    getPayment(){
        return this._payment;
    }
    setPayment(payment){
        this._payment = payment;
    }

    getEmployee(){
        return this._employee;
    }
    setEmployee(employee){
        this._employee = employee;
    }

    getClient(){
        return this._client;
    }
    setClient(client){
        this._client = client;
    }

    getStateRequest(){
        return this._stateRequest;
    }
    setStateRequest(stateRequest){
        this._stateRequest = stateRequest;
    }

    fechaFin(){
        if(this._dateEnd){
            this._dateEnd;
        }else{
            return 'sin datos';
        }
    }

    idSolicitud(){
        if(this._idRequest){
            this._idRequest;
        }else{
            return '"sin datos"';
        }
    }

    toString(){
        return `{"id_solicitud":${this._idRequest},
        "descripcion":"${this._description}",
        "fecha_inicio":"${this._dateStart}",
        "fecha_fin":"${this.fechaFin()}",
        "total_solicitud":"${this._totalRequest}",
        "id_pago":"${this._payment}",
        "empleado":"${this._employee}",
        "cliente":"${this._client}",
        "estado":${this._stateRequest}
        }`;
    }
}

module.exports = Solicitud;