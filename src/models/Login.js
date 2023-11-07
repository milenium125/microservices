class Login{
    constructor(idLogin, username, password, user){
        this._idLogin = idLogin,
        this._username = username,
        this._password = password,
        this._user = user
    }

    getIdLogin(){
        return this._idLogin;
    }
    setIdLogin(idLogin){
        this._idLogin = idLogin;
    }

    getUsername(){
        return this._username;
    }
    setUsername(username){
        this._username = username;
    }

    getPassword(){
        return this._password;
    }
    setPassword(password){
        this._password = password;
    }

    getUser(){
        return this._user;
    }
    setUser(user){
        this._user = user;
    }
}

module.exports = Login;