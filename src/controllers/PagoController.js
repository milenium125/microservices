const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Pago = require('../models/Pago');

async function createPayment(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let payment = new Pago();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        payment.setTotalRequest(req.body.total_solicitud);
        payment.setMethodPayment(req.body.metodo_pago);
        payment.setStatePayment(req.body.estado);
        

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO pago (total_solicitud, id_metodo_pago, id_estado) VALUES (?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            payment.getTotalRequest(),
            payment.getMethodPayment(),
            payment.getStatePayment(),
        ];
        // console.log(cliente);
        try{
            // Ejecución de la sentencia de registro de la persona
            const result_payment = await POOL_CONNECTION.execute(sql, inserts);

            // Obtener el último ID insertado
            var last_id_result = await POOL_CONNECTION.execute("SELECT MAX(id_pago) AS id_pago FROM pago;");
            const last_id = last_id_result[0][0].id_pago;

            console.log("last_id: " + last_id.toString());
            res.status(200).send(last_id.toString());
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

async function findOnePayment(req, res){
    try{
        //se crea el objeto cliente
        let payment = new Pago();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        payment.setIdPayment(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM pago WHERE id_pago = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsPayment, fieldsPayment] = await POOL_CONNECTION.execute(sql, [payment.getIdPayment()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            payment.setTotalRequest(rowsPayment[0].total_solicitud);
            payment.setMethodPayment(rowsPayment[0].id_metodo_pago);
            payment.setStatePayment(rowsPayment[0].id_estado);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(payment));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllPayment(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM pago";

            const [rowsPayment, fieldsPayment] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsPayment.length; i++) {
                //Se instancia la entidad cliente
                let payment = new Pago();
                // console.log(rowsUser);  
                payment.setTotalRequest(rowsPayment[0].total_solicitud);
                payment.setMethodPayment(rowsPayment[0].id_metodo_pago);
                payment.setStatePayment(rowsPayment[0].id_estado);
                response.push(payment);
                
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

async function updateOnePayment(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let payment = new Pago();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_payment= "UPDATE pago SET total_solicitud = ?, id_metodo_pago = ?, id_estado = ? WHERE id_pago = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_payment, [req.body.total_solicitud, req.body.metodo_pago, req.body.estado, req.body.id_pago]);   
            console.log(updateData[0]);  
            payment.setIdPayment(req.body.id_pago);
            payment.setTotalRequest(req.body.total_solicitud);
            payment.setMethodPayment(req.body.metodo_pago);
            payment.setStatePayment(req.body.estado);
            res.status(200).send(JSON.stringify(payment));
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

async function deleteOnePayment(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM pago WHERE id_pago = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllPayment(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM pago";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba8(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createPayment, prueba8, findOnePayment, findAllPayment, updateOnePayment, deleteOnePayment, deleteAllPayment}