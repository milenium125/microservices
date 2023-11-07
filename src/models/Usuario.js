
class Usuario {

    constructor(){
        this._idUser,
        this._firstNameUser,
        this._lastNameUser, 
        this._emailUser,
        this._phoneNumberUser,
        this._typeDocument,
        this._numberDocument,
        this._dateRegister,
        this._addressUser,
        this._pictureProfile
    }

    getIdUser(){
        return this._idUser;
    }
    setIdUser(idUser){
        this._idUser = idUser;
    }

    getFirstNameUser(){
        return this._firstNameUser;
    }
    setFirstNameUser(firstNameUser){
        this._firstNameUser = firstNameUser;
    }

    getLastNameUser(){
        return this._lastNameUser;
    }
    setLastNameUser(lastNameUser){
        this._lastNameUser = lastNameUser;
    }

    getPhoneNumberUser(){
        return this._phoneNumberUser;
    }
    setPhoneNumberUser(phoneNumberUser){
        this._phoneNumberUser = phoneNumberUser;
    }

    getTypeDocument(){
        return this._typeDocument;
    }
    setTypeDocument(typeDocument){
        this._typeDocument = typeDocument;
    }

    getNumberDocument(){
        return this._numberDocument;
    }
    setNumberDocument(numberDocument){
        this._numberDocument = numberDocument;
    }

    getDateRegister(){
        return this._dateRegister;
    }
    setDateRegister(dateRegister){
        this._dateRegister = dateRegister;
    }

    getAddressUser(){
        return this._addressUser;
    }
    setAddressUser(addressUser){
        this._addressUser = addressUser;
    }

    getEmailUser(){
        return this._emailUser;
    }
    setEmailUser(emailUser){
        this._emailUser = emailUser;
    }

    getPictureProfile(){
        return this._pictureProfile;
    }
    setPictureProfile(pictureProfile){
        this._pictureProfile = pictureProfile;
    }


}

module.exports = Usuario;