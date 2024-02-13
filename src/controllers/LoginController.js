const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Login = require('../models/Login');

async function createLogin(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let login = new Login();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        login.setUsername(req.body.username);
        login.setPassword(req.body.password);
        login.setUser(req.body.id_persona);    
        
        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO login (username, contraseña, id_persona) VALUES (?,?,?);";
        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            login.getUsername(),
            login.getPassword(),
            login.getUser(),
        ];
        // console.log(cliente);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_login = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")   
            res.send('Data Insert Successfully: ' + JSON.stringify(login));
        } catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al insertar datos: ' + err.message);
        } finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        } 
        
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function thereIsAnyUser(req, res){
    var username = req.body.username;
    try {
        const sql = "SELECT id_persona FROM login WHERE user = ?;";
        const result_login = await POOL_CONNECTION.execute(sql, [username]);
        //console.log("test")   
        if(result_login.length > 0){
            res.send(JSON.stringify(`{"id_persona": ${result_login[0].id_persona}}`));
        }
    } catch (e) {
        console.log(e)
        res.send('Sin resultados');
    }
}

async function findOneLogin(req, res){
    try{
        //se crea el objeto cliente
        let login = new Login();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        login.setIdLogin(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM login WHERE id_login = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsLogin, fieldsLogin] = await POOL_CONNECTION.execute(sql, [login.getIdLogin()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            login.setUsername(rowsLogin[0].username);
            login.setPassword(rowsLogin[0].password);
            login.setUser(rowsLogin[0].id_persona);    

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(login));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findOneUser(req, res){
    console.log(req.body);
    try{
        //se crea el objeto cliente
        let login = new Login();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        login.setUser(req.params.user)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM login WHERE username = ?";
        
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsLogin, fieldsLogin] = await POOL_CONNECTION.execute(sql, [req.body.username]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            if(rowsLogin.length > 0){
                login.setUsername(rowsLogin[0].username);
                login.setPassword(rowsLogin[0].contraseña);
                login.setUser(rowsLogin[0].id_persona);   
                console.log(login);
                if(login.getPassword() == req.body.password){
                    res.status(200).send({"id_persona":login.getUser()});
                }else{
                    res.status(302).send({"error": "credenciales incorrectas"});   
                }
            }else{
                res.status(500).send({"error": "No encontrado"}); 
            }

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send({"error": "No encontrado"}); 
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllLogin(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM login";

            const [rowsLogin, fieldsLogin] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsLogin.length; i++) {
                //Se instancia la entidad cliente
                let login = new Login();
                // console.log(rowsUser);  
                login.setUsername(rowsLogin[i].username);
                login.setPassword(rowsLogin[i].contraseña);
                login.setUser(rowsLogin[i].id_persona);  
                response.push(login);
                
            }
            res.status(200).send(JSON.stringify(response));
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
    
        
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function updateOneLogin(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let login = new Login();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_login= "UPDATE login SET contraseña = ? WHERE id_persona = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_login, [req.body.password, req.body.id_persona]);   
            console.log(updateData[0]);  
            login.setPassword(req.body.password);
            login.setUser(req.body.id_persona)
            res.status(200).send(JSON.stringify(login));
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Actualizando datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
    }catch(err){
    console.log("Error al actualizar: " + err);
    res.status(500).send(err);
    }
}

async function deleteOneLogin(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM login WHERE id_login = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllLogin(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM login";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba4(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createLogin, prueba4, findOneLogin, findAllLogin, updateOneLogin, deleteOneLogin, deleteAllLogin, findOneUser, thereIsAnyUser}