class Conversacion{
    constructor(idConversation, client, employee, stateConversation, dateStart, dateEnd){
        this._idConversation = idConversation;
        this._client = client;
        this._employee = employee;
        this._stateConversation = stateConversation;
        this._dateStart = dateStart;
        this._dateEnd = dateEnd;
    }

    getIdConversation(){
        return this._idConversation;
    }
    setIdConversation(idConversation){
        this._idConversation = idConversation;
    }

    getClient(){
        return this._client;
    }
    setClient(client){
        this._client = client;
    }

    getEmployee(){
        return this._employee;
    }
    setEmployee(employee){
        this._employee = employee;
    }

    getStateConversation(){
        return this._stateConversation;
    }
    setStateConversation(stateConversation){
        this._stateConversation = stateConversation;
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
}

module.exports = Conversacion;