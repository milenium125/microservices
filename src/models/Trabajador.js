const Usuario = require('./Usuario');
class Trabajador extends Usuario{
    constructor(idUser, firstNameUser, lastNameUser, emailUser, phoneNumberUser, typeDocument, numberDocument, dateRegister, addressUser, pictureProfile, idTrabajador, stateTrabajador, ocupacion,experiencia, titulo, especialidad, id_persona){
        super(idUser, firstNameUser, lastNameUser, emailUser, phoneNumberUser, typeDocument, numberDocument, dateRegister, addressUser, pictureProfile);
        this._idTrabajador = idTrabajador,
        this._stateTrabajador = stateTrabajador,
        this._ocupacion = ocupacion,
        this._titulo = titulo,
        this._experiencia = experiencia,
        this._especialidad = especialidad,
        this._id_persona = id_persona
    }

    getIdTrabajador(){
        return this._idTrabajador;
    }
    setIdTrabajador(idTrabajador){
        this._idTrabajador = idTrabajador;
    }

    getStateTrabajador(){
        return this._stateTrabajador;
    }
    setStateTrabajador(stateTrabajador){
        this._stateTrabajador = stateTrabajador;
    }

    getOcupacion(){
        return this._ocupacion;
    }
    setOcupacion(ocupacion){
        this._ocupacion = ocupacion;
    }

    getExperiencia(){
        return this._experiencia;
    }
    setExperiencia(experiencia){
        this._experiencia = experiencia;
    }

    getTitulo(){
        return this._titulo;
    }
    setTitulo(titulo){
        this._titulo = titulo;
    }

    getEspecialidad(){
        return this._especialidad;
    }
    setEspecialidad(especialidad){
        this._especialidad = especialidad;
    }

    getIdPersona(){
        return this._id_persona;
    }
    setIdPersona(id_persona){
        this._id_persona = id_persona;
    }

    toString(){
        return `{
            "id_trabajador":${this._idTrabajador},
            "nombre":"${this._firstNameUser}",
            "apellido":"${this._lastNameUser}",
            "ocupacion":"${this._ocupacion}",
            "estado":"${this._stateTrabajador}",
            "especialidad":"${this._especialidad}",
            "experiencia":"${this._experiencia}",
            "titulo":"${this._titulo}",
            "id_persona":"${this._idUser}"
        }`;
    }
}

module.exports = Trabajador;