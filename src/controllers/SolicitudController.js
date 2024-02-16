const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Solicitud = require('../models/Solicitud');
const Cliente = require('../models/Cliente');
const Trabajador = require("../models/Trabajador");

async function createRequest(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let request = new Solicitud();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        request.setDescription(req.body.descripcion);
        request.setDateStart(new Date());
        request.setTotalRequest(req.body.total);
        request.setPayment(req.body.pago);
        request.setEmployee(req.body.empleado);
        request.setClient(req.body.cliente);
        request.setStateRequest(req.body.estado);
        
        console.log(request);
        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO solicitud (descripcion, fecha_inicial, total_solicitud, id_pago, id_trabajador, id_cliente, id_estado) VALUES (?,?,?,?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            request.getDescription(),
            request.getDateStart(),
            request.getTotalRequest(),
            request.getPayment(),
            request.getEmployee(),
            request.getClient(),
            request.getStateRequest()
        ];
        
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_request = await POOL_CONNECTION.execute(sql, inserts);
            const last_id = await POOL_CONNECTION.execute("SELECT MAX(id_solicitud) AS id FROM solicitud");
            request.setIdRequest(last_id[0][0].id)
            console.log("ultimo id: "+last_id[0][0].id);
            //console.log("test")   
            res.status(200).send(JSON.stringify(request));
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

async function findOneRequest(req, res){
    try{
        //se crea el objeto cliente
        let request = new Solicitud();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        request.setIdRequest(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM solicitud WHERE id_solicitud = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsRequest, fieldsRequest] = await POOL_CONNECTION.execute(sql, [request.getIdRequest()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            request.setDescription(rowsRequest[0].descripcion);
            request.setDateStart(rowsRequest[0].fecha_inicial);
            request.setTotalRequest(rowsRequest[0].total_solicitud);
            request.setPayment(rowsRequest[0].id_pago);
            request.setEmployee(rowsRequest[0].id_trabajador);
            request.setClient(rowsRequest[0].id_cliente);
            request.setStateRequest(rowsRequest[0].id_estado);
            request.setIdServicio(rowsRequest[0].id_estado);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(JSON.stringify(request));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findOneRequestByState(req, res){
    try{
        //se crea el objeto cliente
        let request = new Solicitud();
        let cliente = new Cliente();
        console.log(req.body);
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql_persona = "SELECT id_cliente FROM cliente where id_persona = ?"

        const [rowsPersona, fieldsPersona] = await POOL_CONNECTION.execute(sql_persona, [req.body.id_sesion]);
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM solicitud WHERE id_cliente = ? AND id_estado = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsRequest, fieldsRequest] = await POOL_CONNECTION.execute(sql, [rowsPersona[0].id_cliente, req.body.estado]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        var solicitudes = [];
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            if(rowsRequest.length === 0){
                res.status(200).send("Objeto no encontrado");
            }else{
                
                for(let i=0; i < rowsRequest.length ; i++){
                    request.setDescription(rowsRequest[i].descripcion);
                    request.setDateStart(rowsRequest[i].fecha_inicial);
                    request.setTotalRequest(rowsRequest[i].total_solicitud);
                    request.setPayment(rowsRequest[i].id_pago);
                    request.setEmployee(rowsRequest[i].id_empleado);
                    request.setClient(rowsRequest[i].id_cliente);
                    request.setStateRequest(rowsRequest[i].id_estado);
                    solicitudes.push(request.toString());
                    
                }
                res.status(200).send(solicitudes);
            }
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

async function findOneRequestByStateTrabajador(req, res){
    try{
        //se crea el objeto cliente
        let request = new Solicitud();
        let trabajador = new Trabajador();
        console.log(req.body);
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        var sql_persona;
        var id_persona;
        if(req.body.id_trabajador){
            sql_persona = "SELECT id_trabajador FROM trabajador where id_persona = ?";
            id_persona = req.body.id_trabajador;
            console.log("consulta trabajador");
        }if(req.body.id_cliente){
            sql_persona = "SELECT id_cliente FROM cliente where id_persona = ?";
            id_persona = req.body.id_cliente;
            console.log("consulta cliente");
        }
        const [rowsPersona, fieldsPersona] = await POOL_CONNECTION.execute(sql_persona, [id_persona]);
        console.log(rowsPersona[0]);
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        var sql;
        if(req.body.id_trabajador){
            sql = "SELECT * FROM solicitud WHERE id_trabajador = ? AND id_estado = ?";
            id_persona = rowsPersona[0].id_trabajador;
            console.log("consulta trabajador");
        }if(req.body.id_cliente){
            sql = "SELECT * FROM solicitud WHERE id_cliente = ? AND id_estado = ?";
            id_persona = rowsPersona[0].id_cliente;
            console.log("consulta cliente");
        }
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsRequest, fieldsRequest] = await POOL_CONNECTION.execute(sql, [id_persona, req.body.estado]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        var solicitudes = [];
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            if(rowsRequest.length === 0){
                res.status(200).send("Objeto no encontrado");
            }else{
                
                for(let i=0; i < rowsRequest.length ; i++){
                    request.setIdRequest(rowsRequest[i].id_solicitud);
                    request.setDescription(rowsRequest[i].descripcion);
                    request.setDateStart(rowsRequest[i].fecha_inicial);
                    request.setTotalRequest(rowsRequest[i].total_solicitud);
                    request.setPayment(rowsRequest[i].id_pago);
                    request.setEmployee(rowsRequest[i].id_trabajador);
                    request.setClient(rowsRequest[i].id_cliente);
                    request.setStateRequest(rowsRequest[i].id_estado);
                    solicitudes.push(request.toString());
                    
                }
                res.status(200).send(solicitudes);
            }
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

async function findAllRequest(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM solicitud";

            const [rowsRequest, fieldsRequest] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsRequest.length; i++) {
                //Se instancia la entidad cliente
                let request = new Solicitud();
                // console.log(rowsUser);  
                request.setDescription(rowsRequest[i].descripcion);
                request.setDateStart(rowsRequest[i].fecha_inicial);
                request.setTotalRequest(rowsRequest[i].total_solicitud);
                request.setPayment(rowsRequest[i].id_pago);
                request.setEmployee(rowsRequest[i].id_empleado);
                request.setClient(rowsRequest[i].id_cliente);
                request.setStateRequest(rowsRequest[i].id_estado);
                response.push(request);
                
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

async function updateOneRequest(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let request = new Solicitud();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_request= "UPDATE solicitud SET descripcion = ?, fecha_fin = ? , id_empleado = ?, id_estado = ?, total_solicitud = ? WHERE id_solicitud = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_request, [req.body.descripcion, req.body.fecha_fin, req.body.empleado, req.body.estado, req.body.total, req.body.id_solicitud]);   
            console.log(updateData[0]);  
            request.setIdRequest(req.body.id_solicitud);
            request.setDescription(req.body.descripcion);
            request.setTotalRequest(req.body.total);
            request.setEmployee(req.body.empleado);
            request.setStateRequest(req.body.estado);
            request.setDateEnd(req.body.fecha_fin);

            res.status(200).send(JSON.stringify(request));
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

async function updateOneRequestByState(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let request = new Solicitud();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_request= "UPDATE solicitud SET id_estado = ? WHERE id_solicitud = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_request, [req.body.estado, req.body.id_solicitud]);   
            console.log(updateData[0]);  
            request.setIdRequest(req.body.id_solicitud);
            request.setStateRequest(req.body.estado);

            res.status(200).send(JSON.stringify(request));
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

async function deleteOneRequest(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM solicitud WHERE id_solicitud = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllRequest(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM solicitud";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba7(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createRequest, prueba7, findOneRequest, findAllRequest, updateOneRequest, deleteOneRequest, deleteAllRequest, findOneRequestByState, findOneRequestByStateTrabajador, updateOneRequestByState}