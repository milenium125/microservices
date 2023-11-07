class Mensaje{
    constructor(idMessage, message, date, time, conversation, user, stateMessage){
        this._idMessage = idMessage,
        this._message = message,
        this._date = date,
        this._time = time,
        this._conversation = conversation,
        this._user = user,
        this._stateMessage = stateMessage
    }

    getIdMessage(){
        return this._idMessage;
    }
    setIdMessage(idMessage){
        this._idMessage = idMessage;
    }

    getMessage(){
        return this._message;
    }
    setMessage(message){
        this._message = message;
    }

    getDate(){
        return this._date;
    }
    setDate(date){
        this._date = date;
    }

    getTime(){
        return this._time;
    }
    setTime(time){
        this._time = time;
    }

    getConversation(){
        return this._conversation;
    }
    setConversation(conversation){
        this._conversation = conversation;
    }

    getUser(){
        return this._user;
    }
    setUser(user){
        this._user = user;
    }

    getStateMessage(){
        return this._stateMessage;
    }
    setStateMessage(stateMessage){
        this._stateMessage = stateMessage;
    }
}

module.exports = Mensaje;