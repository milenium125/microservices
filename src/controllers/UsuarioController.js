const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Cliente = require('../models/Cliente');
const Conversacion = require('../models/Conversacion');

async function createConversation(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let conversation = new Conversacion();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        conversation.setClient(req.body.cliente);
        conversation.setEmployee(req.body.empleado);
        conversation.setDateStart(new Date());
        conversation.setStateConversation(1);
        

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO conversacion (id_cliente, id_empleado, id_estado, fecha_inicio) VALUES (?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            conversation.getClient().id_cliente,
            conversation.getEmployee().id_empleado,
            conversation.getStateConversation(),
            conversation.getDateStart(),
        ];
        // console.log(cliente);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_conversation = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")   
            res.send('Data Insert Successfully: ' + JSON.stringify(conversation));
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

async function findOneConversation(req, res){
    try{
        //se crea el objeto cliente
        let conversation = new Conversacion();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        conversation.setIdConversation(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM conversacion WHERE id_conversacion = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsConversation, fieldsConversation] = await POOL_CONNECTION.execute(sql, [conversation.getIdConversation()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            conversation.setClient(rowsConversation[0].id_cliente);
            conversation.setEmployee(rowsConversation[0].id_empleado);
            conversation.setDateStart(rowsConversation[0].fecha_inicio);
            conversation.setDateEnd(rowsConversation[0].fecha_final); 
            conversation.setStateConversation(rowsConversation[0].id_estado);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(conversation));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllConversation(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM conversacion";

            const [rowsConversation, fieldsConversation] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsConversation.length; i++) {
                //Se instancia la entidad cliente
                let conversation = new Conversacion();
                // console.log(rowsUser);  
                conversation.setIdConversation(rowsConversation[i].id_conversacion)              
                conversation.setClient(rowsConversation[i].id_cliente);
                conversation.setEmployee(rowsConversation[i].id_empleado);
                conversation.setDateStart(rowsConversation[i].fecha_inicio);
                conversation.setDateEnd(rowsConversation[i].fecha_final); 
                conversation.setStateConversation(rowsConversation[i].id_estado);
                response.push(conversation);
                
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

async function updateOneConversation(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let conversation = new Conversacion();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_conversation= "UPDATE conversacion SET id_estado = ?, fecha_final = ? WHERE id_conversacion = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_conversation, [req.body.estado, req.body.fecha_final, req.body.id_conversacion]);   
            console.log(updateData[0]);  
            conversation.setStateConversation(req.body.estado);
            conversation.setDateEnd(req.body.fecha_final);
            conversation.setIdConversation(req.body.id_conversacion);
            res.status(200).send(JSON.stringify(conversation));
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

async function deleteOneConversation(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM conversacion WHERE id_conversacion = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllConversation(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM conversacion";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba3(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createConversation, prueba3, findOneConversation, findAllConversation, updateOneConversation, deleteOneConversation, deleteAllConversation}