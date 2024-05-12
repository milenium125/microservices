class Calificacion{
    constructor(){
        this._idCalificacion = undefined;
        this._nota = undefined;
        this.comentario = undefined;
        this._idEvaluado = undefined;
        this._idEvaluador = undefined;
    }
    //Metodos Getters y Setters
    
    getIdCalificacion(){
        return this._idCalificacion;
    }
    setIdCalificacion(id){
        this._idCalificacion = id;
    }

    getNota(){
        return this._nota;
    }
    setNota(id){
        this._nota = id;
    }

    getComentario(){
        return this._comentario;
    }
    setComentario(id){
        this._comentario = id;
    }
    
    getIdEvaluado(){
        return this._idEvaluado;
    }
    setIdEvaluado(id){
        this._idEvaluado = id;
    }

    getIdEvaluador(){
        return this._idEvaluador;
    }
    setIdEvaluador(id){
        this._idEvaluador = id;
    }

    //Metodo toString

}

module.exports = Calificacion;