class Solicitud{
    constructor(idRequest, description, dateStart, dateEnd, totalRequest, payment, employee, client, stateRequest){
        this._idRequest = idRequest,
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
}

module.exports = Solicitud;