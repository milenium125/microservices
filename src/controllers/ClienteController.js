const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Cliente = require('../models/Cliente');

async function createCustomer(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        console.log("cliente: ");
        //creacion del objeto cliente
        let cliente = new Cliente();
        console.log("cliente: ");
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        cliente.setFirstNameUser(req.body.name);
        console.log("cliente: "+cliente);
        cliente.setLastNameUser(req.body.lastname);
        cliente.setEmailUser(req.body.email);
        cliente.setPhoneNumberUser(req.body.phonenumber);
        cliente.setTypeDocument(req.body.type_dni);
        cliente.setNumberDocument(req.body.dni);
        cliente.setDateRegister(new Date());
        cliente.setAddressUser(req.body.address);
        cliente.setPictureProfile("D:/Documentos/Microservices_v01/microservices_backend/src/assets/sin_imagen.jpg");
        console.log("cliente: "+cliente);
        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del cliente
        const sql = "INSERT INTO persona (nombres, apellidos, telefono, direccion, email, foto_perfil, numero_documento, id_tipo_documento) VALUES (?,?,?,?,?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            cliente.getFirstNameUser(),
            cliente.getLastNameUser(),
            cliente.getPhoneNumberUser(),
            cliente.getAddressUser(),
            cliente.getEmailUser(),
            cliente.getPictureProfile(),
            cliente.getNumberDocument(),
            cliente.getTypeDocument()
        ];
        console.log("inserts: "+inserts);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_user = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")
            //ejecucion de la sentencia para saber el id_persona del ultimo registro
            const [rows, fields] = await POOL_CONNECTION.execute("SELECT id_persona AS id FROM persona WHERE numero_documento = ?", [cliente.getNumberDocument()]);
            //console.log(rows);
            //en este if se verifica si en la consulta hay almenos un registro para poder proceder
            if (rows.length > 0) {
                cliente.setIdUser(rows[0].id); // Accede al valor directamente
                console.log("ID del registro insertado: " + cliente.getIdUser());
            } else {
                console.error("No se encontró ningún ID.");
            }
            cliente.setStateClient(3); //estado por defecto que es el de verificar, una vez el cliente verifica sus datos pasa a estado activo
            cliente.setRolClient(2); //este tipo de cliente debe venir definido en el body de la peticion, con el fin de crear clientes standard o premium segun se desee
            //sentencia sql para registrar un nuevo cliente
            let sql_customer = "INSERT INTO cliente (id_persona, id_estado, id_tipo_cliente) VALUES (?, ?, ?) ";
            //creacion del array para setear los valores en la sentencia (prepared statement)

            let inserts_customer = [
                cliente.getIdUser(),
                cliente.getStateClient(),
                cliente.getRolClient()
            ];
            //ejecucion de la sentencia para registrar un nuevo cliente
            const result_customer = await POOL_CONNECTION.execute(sql_customer, inserts_customer);
            console.log('Customer Insert Successfully');
            //console.log(result_user);
            //devolucion del objeto cliente al cliente de la API
            console.log(cliente);
            res.send(JSON.stringify(cliente));
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

async function findOneCustomer(req, res){
    try{
        //se crea el objeto cliente
        let cliente = new Cliente();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        cliente.setIdClient(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM cliente WHERE id_cliente = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
        const [rowsCustomer, fieldsCustomer] = await POOL_CONNECTION.execute(sql, [cliente.getIdClient()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del cliente
        const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
        try{
            
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla cliente
            cliente.setIdUser(rowsCustomer[0].id_persona);
            //se ejecuta consulta a la tabla persona para obtener los datos personales, el resultado se guarda en rowUser
            const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [cliente.getIdUser()]);
            //se ejecuta la sentencia a la tabla estado para saber el valor del estado segun el id_estado obtenido de la consulta a la tabla cliente
            const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [rowsCustomer[0].id_estado]);
            //se setea al objeto cliente el id_tipo de cliente para obtener el valor y setearlo de nuevo al objeto
            const [tipoCliente, fieldTipoCliente] = await POOL_CONNECTION.execute("SELECT * FROM tipo_cliente WHERE id_tipo_cliente = ?", [rowsCustomer[0].id_tipo_cliente]);
            //se setea el valor de la consulta al rol del cliente del objeto
            cliente.setRolClient(tipoCliente[0].tipo_cliente);
            //
            const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
            cliente.setTypeDocument(tipoDocumento[0].tipo_documento);
            
            cliente.setFirstNameUser(rowsUser[0].nombres);
            cliente.setLastNameUser(rowsUser[0].apellidos);
            cliente.setEmailUser(rowsUser[0].email);
            cliente.setPhoneNumberUser(rowsUser[0].telefono); 
            cliente.setNumberDocument(rowsUser[0].numero_documento);
            cliente.setDateRegister(new Date().getDate());
            cliente.setAddressUser(rowsUser[0].direccion);
            cliente.setPictureProfile(rowsUser[0].foto_perfil);
            cliente.setStateClient(estado[0].estado);
            console.log(cliente);
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(cliente);
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findOneClient(req, res){
    try{
        //se crea el objeto cliente
        var cliente = new Cliente();
        //se introduce el parametro id_cliente proporcionado mediante el parametro :id del endpoint
        cliente.setIdUser(req.params.id)
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla cliente segun el id_cliente enviado por el parametro :id
        const sql = "SELECT * FROM cliente WHERE id_persona = ?";
        console.log("id: "+req.params.id)
        
        try{
            //se ejecuta la sentencia y se setea el parametro del objeto cliente id_client  a la sentencia sql
            const [rowsCustomer, fieldsCustomer] = await POOL_CONNECTION.execute(sql, [req.params.id]);
            console.log("id cliente: "+ rowsCustomer[0])
            cliente.setIdClient(rowsCustomer[0].id_cliente);
        //     cliente.setFirstNameUser(rowsCustomer[0].nombre);
        //     cliente.setLastNameUser(rowsCustomer[0].apellido);
        //     cliente.setAddressUser(rowsCustomer[0].id_cliente);
        //     cliente.setPhoneNumberUser(rowsCustomer[0].id_cliente);
        //     cliente.setPictureProfile(rowsCustomer[0].id_cliente);
        //     cliente.setNumberDocument(rowsCustomer[0].id_cliente);
        //     cliente.setRolClient(rowsCustomer[0].id_cliente);
        //     cliente.setEmailUser(rowsCustomer[0].id_cliente);
        //     cliente.setStateClient(rowsCustomer[0].id_cliente);
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send(cliente);
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}


async function findAllCustomer(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM cliente";

            const [rowsCustomer, fieldsCustomer] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsCustomer.length; i++) {
                //Se instancia la entidad cliente
                let cliente = new Cliente();
                //sentencia para saber los datos personales del cliente en la tabla persona
                const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
                
                const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [rowsCustomer[i].id_persona]);
                // console.log(rowsUser);
                const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [rowsCustomer[i].id_estado]);
                // console.log(estado);
                const [tipoCliente, fieldTipoCliente] = await POOL_CONNECTION.execute("SELECT * FROM tipo_cliente WHERE id_tipo_cliente = ?", [rowsCustomer[i].id_tipo_cliente]);
                const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
                
                cliente.setIdUser(rowsUser[0].id_persona);
                cliente.setIdClient(rowsCustomer[0].id_cliente);
                cliente.setFirstNameUser(rowsUser[0].nombres);
                cliente.setLastNameUser(rowsUser[0].apellidos);
                cliente.setEmailUser(rowsUser[0].email);
                cliente.setPhoneNumberUser(rowsUser[0].telefono); 
                cliente.setNumberDocument(rowsUser[0].numero_documento);
                cliente.setDateRegister(new Date());
                cliente.setAddressUser(rowsUser[0].direccion);
                cliente.setPictureProfile(rowsUser[0].foto_perfil);
                cliente.setRolClient(tipoCliente[0].tipo_cliente);
                cliente.setTypeDocument(tipoDocumento[0].tipo_documento);
                cliente.setStateClient(estado[0].estado);
                
                response.push(cliente);
                
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

async function updateOneCustomer(req, res){
    //se puede actualizar de la tabla cliente solo: estado y tipo cliente
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad cliente
    let cliente = new Cliente();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_cliente pasado mediante el body de la consulta
            const sql_cliente_consulta = "SELECT id_persona AS id FROM cliente WHERE id_cliente = ?";
            const [id_persona, fieldsConsulta] = await POOL_CONNECTION.execute(sql_cliente_consulta,[req.body.id_cliente]);
            const sql_persona = "UPDATE persona SET nombres = ?, apellidos = ?, telefono = ?, direccion = ?, email = ?, foto_perfil = ?, numero_documento = ? WHERE id_persona = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_persona, [req.body.nombres, req.body.apellidos, req.body.telefono, req.body.direccion, req.body.email, req.body.foto_perfil, req.body.numero_documento, id_persona[0].id]);
            const sql_cliente = "UPDATE cliente SET id_estado = ?, id_tipo_cliente = ? WHERE id_cliente = ?";
            await POOL_CONNECTION.execute(sql_cliente, [req.body.id_estado, req.body.id_tipo_cliente, req.body.id_cliente]);
            
            const [tipoCliente, fieldTipoCliente] = await POOL_CONNECTION.execute("SELECT * FROM tipo_cliente WHERE id_tipo_cliente = ?", [req.body.id_tipo_cliente]);
            const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [req.body.id_estado]);

            cliente.setFirstNameUser(req.body.nombres);
            cliente.setLastNameUser(req.body.apellidos);
            cliente.setPhoneNumberUser(req.body.telefono);
            cliente.setAddressUser(req.body.direccion);
            cliente.setEmailUser(req.body.email);
            cliente.setPictureProfile(req.body.foto_perfil);
            cliente.setNumberDocument(req.body.numero_documento);
            cliente.setRolClient(tipoCliente[0].tipo_cliente);
            cliente.setStateClient(estado[0].estado);

            res.status(200).send(JSON.stringify(cliente));
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

async function deleteOneCustomer(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM cliente WHERE id_cliente = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllCustomer(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM cliente";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createCustomer, prueba, findOneCustomer, findAllCustomer, updateOneCustomer, deleteOneCustomer, deleteAllCustomer, findOneClient}