const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Servicio = require('../models/Servicio');

async function createService(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto cliente
        let service = new Servicio();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        service.setService(req.body.servicio);
        service.setDescription(req.body.descripcion);
        service.setPrice(req.body.precio);
        service.setStateService(1);
        

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO servicios (servicio, descripcion, precio, id_estado) VALUES (?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            service.getService(),
            service.getDescription(),
            service.getPrice(),
            service.getStateService(),
        ];
         console.log(inserts);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_service = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")   
            res.send('Data Insert Successfully: ' + JSON.stringify(service));
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

async function findOneService(req, res){
    try{
        //se crea el objeto cliente
        let service = new Servicio();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        service.setIdService(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM servicios WHERE id_servicio = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql, [service.getIdService()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        try{  
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            service.setService(rowsService[0].servicio);
            service.setDescription(rowsService[0].descripcion);
            service.setPrice(rowsService[0].precio);
            service.setStateService(rowsService[0].id_estado);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(service));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllService(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM servicios";

            const [rowsService, fieldsService] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsService.length; i++) {
                //Se instancia la entidad cliente
                let service = new Servicio();
                // console.log(rowsUser);  
                service.setService(rowsService[i].servicio);
                service.setDescription(rowsService[i].descripcion);
                service.setPrice(rowsService[i].precio);
                service.setStateService(rowsService[i].id_estado);
                response.push(service);
                
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

async function updateOneService(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let service = new Servicio();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_service= "UPDATE servicios SET servicio = ?, descripcion = ?, precio = ?, id_estado = ? WHERE id_servicio = ?";
            service.setIdService(req.body.id_servicio)
            service.setService(req.body.servicio);
            service.setDescription(req.body.descripcion);
            service.setPrice(req.body.precio);
            service.setStateService(req.body.id_estado);
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_service, [service.getService(), service.getDescription(), service.getPrice(), service.getStateService(), service.getIdService()]);   
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

async function deleteOneService(req, res){
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

async function deleteAllService(req, res){
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

function prueba3(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createService, prueba3, findOneService, findAllService, updateOneService, deleteOneService, deleteAllService}