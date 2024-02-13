const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const ServicioSolicitud = require('../models/ServicioSolicitud');

async function createServiceSolicitud(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let service = new ServicioSolicitud();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        service.setServicio(req.body.id_servicio);
        service.setIdSolicitud(req.body.id_solicitud);

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO servicios_solicitud (id_servicio, id_solicitud) VALUES (?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            service.getServicio(),
            service.getIdSolicitud()
            
        ];
         console.log(inserts);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_service = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")   
            res.send(JSON.stringify(service));
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

async function findOneServiceSolicitud(req, res){
    try{
        //se crea el objeto cliente
        let service = new ServicioSolicitud();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        service.setIdServicioSolicitud(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM servicios_solicitud WHERE id_servicio_solicitud = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql, [service.getIdServicioSolicitud()]);
        
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            service.setIdSolicitud(rowsService[0].id_solicitud);
            service.setServicio(rowsService[0].id_servicio);
            console.log(service);
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(JSON.stringify(service));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findOneServiceSolicitudByIdSolicitud(req, res){
    try{
        //se crea el objeto cliente
        let service = new ServicioSolicitud();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM servicios_solicitud WHERE id_solicitud = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql, [req.params.id]);
        
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            service.setIdServicioSolicitud(rowsService[0].id_servicio_solicitud);
            service.setIdSolicitud(rowsService[0].id_solicitud);
            service.setServicio(rowsService[0].id_servicio);
            console.log(service);
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(JSON.stringify(service));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}


async function findAllServiceSolicitud(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM servicios_solicitud";

            const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsService.length; i++) {
                //Se instancia la entidad cliente
                let service = new ServicioSolicitud();
                // console.log(rowsUser);  
                service.setIdSolicitud(rowsService[0].id_solicitud);
                service.setServicio(rowsService[0].id_servicio);
                response.push(JSON.stringify(service));
                
            }
            res.status(200).send(response);
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

async function updateOneServiceSolicitud(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let service = new ServicioSolicitud();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_service= "UPDATE servicios_solicitud SET id_servicio = ?, id_solicitud = ? WHERE id_servicio_solicitud = ?";
            service.setIdServicioSolicitud(req.body.id_servicio_solicitud)
            service.setServicio(req.body.servicio);
            service.setIdSolicitud(req.body.id_solicitud);
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_service, [service.getIdServicioSolicitud(), service.getServicio(), service.getIdSolicitud()]);   
            console.log(updateData[0]);     
            res.status(200).send(JSON.stringify(service));
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

///falta configurar da aca de aca para abajo

async function deleteOneServiceSolicitud(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM servicios WHERE id_servicio = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllServiceSolicitud(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM servicios";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}


module.exports = {createServiceSolicitud, findOneServiceSolicitud, findAllServiceSolicitud, updateOneServiceSolicitud, deleteOneServiceSolicitud, deleteAllServiceSolicitud, findOneServiceSolicitudByIdSolicitud}