class Pago{
    constructor(idPayment, totalRequest, methodPayment, statePayment){
        this._idPayment = idPayment,
        this._totalRequest = totalRequest,
        this._methodPayment = methodPayment,
        this._statePayment = statePayment
    }

    getIdPayment(){
        return this._idPayment;
    }
    setIdPayment(idPayment){
        this._idPayment = idPayment;
    }

    getTotalRequest(){
        return this._totalRequest;
    }
    setTotalRequest(totalRequest){
        this._totalRequest = totalRequest;
    }

    getMethodPayment(){
        return this._methodPayment;
    }
    setMethodPayment(methodPayment){
        this._methodPayment = methodPayment;
    }

    getStatePayment(){
        return this._statePayment;
    }
    setStatePayment(statePayment){
        this._statePayment = statePayment;
    }
}

module.exports = Pago;