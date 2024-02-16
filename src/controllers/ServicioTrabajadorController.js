const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const ServicioTrabajador = require("../models/ServicioTrabajador");

async function createServiceTrabajador(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let service = new ServicioTrabajador();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        service.setServicio(req.body.id_servicio);
        service.setIdTrabajador(req.body.id_trabajador);
        service.setPrecio(req.body.precio);


        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO servicios_empleado (id_servicio, precio, id_trabajador) VALUES (?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            service.getServicio(),
            service.getPrecio(),
            service.getIdTrabajador()            
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

async function findOneServiceTrabajador(req, res){
    try{
        //se crea el objeto cliente
        let service = new ServicioTrabajador();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        service.setIdServicioSolicitud(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM servicios_empleado WHERE id_servicio_empleado = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql, [service.getIdServicioSolicitud()]);
        
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            service.setServicio(rowsService[0].id_servicio);
            service.setIdTrabajador(rowsService[0].id_trabajador);
            service.setPrecio(rowsService[0].precio);
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

async function findOneServiceTrabajadorByIdTrabajador(req, res){
    try{
        //se crea el objeto cliente
        let service = new ServicioTrabajador();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM servicios_empleado WHERE id_trabajador = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql, [req.params.id]);
        console.log(rowsService);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            var response = [];
            for (let i = 0; i < rowsService.length; i++) {
                //Se instancia la entidad cliente
                let service = new ServicioTrabajador();
                // console.log(rowsUser);  
                service.setIdServicioTrabajador(rowsService[i].id_servicio_trabajador);
                service.setServicio(rowsService[i].id_servicio);
                service.setIdTrabajador(rowsService[i].id_trabajador);
                service.setPrecio(rowsService[i].precio);
                console.log(JSON.stringify(service));
                response.push(service);
            }
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(response);
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}


async function findAllServiceTrabajador(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM servicios_empleado";

            const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsService.length; i++) {
                //Se instancia la entidad cliente
                let service = new ServicioTrabajador();
                // console.log(rowsUser);  
                service.setServicio(rowsService[0].id_servicio);
                service.setIdTrabajador(rowsService[0].id_trabajador);
                service.setPrecio(rowsService[0].precio);
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

async function updateOneServiceTrabajador(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let service = new ServicioTrabajador();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_service= "UPDATE servicios_empleado SET id_servicio = ?, precio = ?, id_trabajador = ? WHERE id_servicio_empleado = ?";
            service.setIdServicioTrabajador(req.body.id_servicio_trabajador)
            service.setServicio(req.body.id_servicio);
            service.setIdTrabajador(req.body.id_trabajador);
            service.setPrecio(req.body.precio);
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

async function deleteOneServiceTrabajador(req, res){
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

async function deleteAllServiceTrabajador(req, res){
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


module.exports = {createServiceTrabajador, findOneServiceTrabajador, findAllServiceTrabajador, updateOneServiceTrabajador, deleteOneServiceTrabajador, deleteAllServiceTrabajador, findOneServiceTrabajadorByIdTrabajador}