const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Mensaje = require('../models/Mensaje');

async function createMessage(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let message = new Mensaje();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        message.setMessage(req.body.mensaje);
        message.setConversation(req.body.conversacion);
        message.setUser(req.body.persona);
        message.setStateMessage(2);
        message.setDate("2023-11-05");
        message.setTime("13:00");
        

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO mensajes (mensaje, id_conversacion, id_emisor_persona, id_estado_mensaje, fecha, hora) VALUES (?,?,?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            message.getMessage(),
            message.getConversation(),
            message.getUser(),
            message.getStateMessage(),
            message.getDate(),
            message.getTime(),
        ];
        console.log(message);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_message = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")   
            res.send('Data Insert Successfully: ' + JSON.stringify(message));
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

async function findOneMessage(req, res){
    try{
        //se crea el objeto cliente
        let message = new Mensaje();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        message.setIdMessage(req.params.id)
        //Obtener conexion a la BBDD
        console.log(message);
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = `SELECT * FROM mensajes WHERE id_mensaje = ${message.getIdMessage()}`;
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            const [rowsMessage, fieldsMessage] = await POOL_CONNECTION.execute(sql, );
            console.log(rowsMessage);
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            console.log(rowsMessage[0]);
            message.setMessage(rowsMessage[0].mensaje);
            message.setConversation(rowsMessage[0].conversacion);
            message.setUser(rowsMessage[0].id_emisor_persona);
            message.setStateMessage(rowsMessage[0].id_estado_mensaje);
            message.setDate(rowsMessage[0].fecha);
            message.setTime(rowsMessage[0].hora);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(message));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllMessage(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM mensajes";

            const [rowsMessage, fieldsMessage] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsMessage.length; i++) {
                //Se instancia la entidad cliente
                let message = new Mensaje();
                // console.log(rowsUser);  
                message.setMessage(rowsMessage[i].mensaje);
                message.setConversation(rowsMessage[i].conversacion);
                message.setUser(rowsMessage[i].id_emisor_persona);
                message.setStateMessage(rowsMessage[i].id_estado_mensaje);
                message.setDate(rowsMessage[i].fecha);
                message.setTime(rowsMessage[i].hora);
                response.push(message);
                
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

async function updateOneMessage(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let message = new Mensaje();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_message= "UPDATE mensajes SET id_estado_mensaje = ? WHERE id_mensaje = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_message, [req.body.estado, req.body.id_mensaje]);   
            console.log(updateData[0]);  
            message.setIdMessage(req.body.id_mensaje);
            message.setStateMessage(req.body.estado);
            res.status(200).send(JSON.stringify(message));
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

async function deleteOneMessage(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM mensajes WHERE id_mensaje = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllMessage(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM mensajes";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba5(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createMessage, prueba5, findOneMessage, findAllMessage, updateOneMessage, deleteOneMessage, deleteAllMessage}