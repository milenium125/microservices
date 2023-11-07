const Usuario = require('./Usuario');
class Empleado extends Usuario{
    constructor(idUser, firstNameUser, lastNameUser, emailUser, phoneNumberUser, typeDocument, numberDocument, dateRegister, addressUser, pictureProfile, idEmployee, stateEmployee, rolEmployee){
        super(idUser, firstNameUser, lastNameUser, emailUser, phoneNumberUser, typeDocument, numberDocument, dateRegister, addressUser, pictureProfile);
        this._idEmployee = idEmployee,
        this._stateEmployee = stateEmployee,
        this._rolEmployee = rolEmployee
    }

    getIdEmployee(){
        return this._idEmployee;
    }
    setIdEmployee(idEmployee){
        this._idEmployee = idEmployee;
    }

    getStateEmployee(){
        return this._stateEmployee;
    }
    setStateEmployee(stateEmployee){
        this._stateEmployee = stateEmployee;
    }

    getRolEmployee(){
        return this._rolEmployee;
    }
    setRolEmployee(rolEmployee){
        this._rolEmployee = rolEmployee;
    }

}

module.exports = Empleado;