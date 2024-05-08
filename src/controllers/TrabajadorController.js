const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Trabajador = require('../models/Trabajador');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now());
    }
})

async function createTrabajador(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto trabajador
        let trabajador = new Trabajador();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        trabajador.setFirstNameUser(req.body.name);
        trabajador.setLastNameUser(req.body.lastname);
        trabajador.setEmailUser(req.body.email);
        trabajador.setPhoneNumberUser(req.body.phonenumber);
        trabajador.setTypeDocument(1);
        trabajador.setNumberDocument(req.body.dni);
        trabajador.setDateRegister(new Date());
        trabajador.setAddressUser(req.body.address);
        trabajador.setPictureProfile("D:/Documentos/Microservices_v01/microservices_backend/src/assets/sin_imagen.jpg");
        trabajador.setEspecialidad(req.body.especialidad);
        trabajador.setOcupacion(req.body.ocupacion);
        trabajador.setTitulo(req.body.titulo);

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del trabajador
        const sql = "INSERT INTO persona (nombres, apellidos, telefono, direccion, email, foto_perfil, numero_documento, id_tipo_documento) VALUES (?,?,?,?,?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            trabajador.getFirstNameUser(),
            trabajador.getLastNameUser(),
            trabajador.getPhoneNumberUser(),
            trabajador.getAddressUser(),
            trabajador.getEmailUser(),
            trabajador.getPictureProfile(),
            trabajador.getNumberDocument(),
            trabajador.getTypeDocument()
        ];
        // console.log(trabajador);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_user = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")
            //ejecucion de la sentencia para saber el id_persona del ultimo registro
            console.log("primeros parametros: "+ trabajador.getNumberDocument());
            const [rows, fields] = await POOL_CONNECTION.execute("SELECT id_persona AS id FROM persona WHERE numero_documento = ?", [trabajador.getNumberDocument()]);
            //console.log(rows);
            //en este if se verifica si en la consulta hay almenos un registro para poder proceder
            if (rows.length > 0) {
                trabajador.setIdUser(rows[0].id); // Accede al valor directamente
                console.log("ID del registro insertado: " + trabajador.getIdUser());
            } else {
                console.error("No se encontró ningún ID.");
            }
            trabajador.setStateTrabajador(3); //estado por defecto que es el de verificar, una vez el trabajador verifica sus datos pasa a estado activo
            //sentencia sql para registrar un nuevo trabajador
            let sql_trabajador = "INSERT INTO trabajador (ocupacion,titulo, id_persona, especialidad,estado) VALUES (?, ?, ?, ?, ?) ";
            //creacion del array para setear los valores en la sentencia (prepared statement)

            let inserts_trabajador = [
                trabajador.getOcupacion(),
                trabajador.getTitulo(),
                trabajador.getIdUser(),
                trabajador.getEspecialidad(),
                trabajador.getStateTrabajador()
            ];
            console.log("parametros 2: "+ inserts_trabajador);
            //ejecucion de la sentencia para registrar un nuevo trabajador
            const result_Trabajador = await POOL_CONNECTION.execute(sql_trabajador, inserts_trabajador);

            const [rows_documentos, fields_documentos] = await POOL_CONNECTION.execute("SELECT id_trabajador AS id FROM trabajador WHERE id_persona = ?", [trabajador.getIdUser()]);
            console.log("parametros 3: "+ [req.body.cedula, req.body.diploma, req.body.experiencia, rows_documentos[0].id]);
            const [rows_registro, fields_registro] = await POOL_CONNECTION.execute("INSERT INTO documentacion(foto_cc, diploma_bachiller, experiencia, id_trabajador) VALUES (?,?,?,?)", [req.body.cedula, req.body.diploma, req.body.experiencia, rows_documentos[0].id]);

            

            console.log('Trabajador Insert Successfully');
            //console.log(result_user);
            //devolucion del objeto trabajador al trabajador de la API
            console.log(trabajador);
            res.send(JSON.stringify(trabajador));
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
        }
        res.status(200).send(cliente);
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }finally{
        closePOOL_CONNECTION(POOL_CONNECTION);
    }
}

async function findOneTrabajador(req, res){
    try{
        //se crea el objeto trabajador
        let trabajador = new Trabajador();
        //se introduce el parametro id_trabajador proporcionado mediante el parametro :id del endpoint
        trabajador.setIdUser(req.params.id) //req.params.id --> contiene el id del trabajador y no de la persona
        //console.log(trabajador.getIdTrabajador());
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla trabajador segun el id_trabajador enviado por el parametro :id
        const sql = "SELECT * FROM trabajador WHERE id_trabajador = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto trabajador id_client  a la sentencia sql
        const [rowsTrabajador, fieldsTrabajador] = await POOL_CONNECTION.execute(sql, [trabajador.getIdUser()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del trabajador
        trabajador.setIdTrabajador(req.params.id);
        if(rowsTrabajador.length > 0){
            const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
            try{
                console.log(rowsTrabajador);
                //se setea el parametro de id_persona obtenido de la consulta sql a la tabla trabajador
                trabajador.setIdUser(rowsTrabajador[0].id_persona);
                //console.log(trabajador.getIdUser());
                console.log(trabajador);
                console.log(rowsTrabajador);
                //se ejecuta consulta a la tabla persona para obtener los datos personales, el resultado se guarda en rowUser
                const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [trabajador.getIdUser()]);
                console.log(rowsUser);
                const sql_data_trabajador = "SELECT * FROM trabajador WHERE id_persona = ?";
                const [datosTrabajador, fieldsDatos] = await POOL_CONNECTION.execute(sql_data_trabajador, [trabajador.getIdUser()]);
                //se ejecuta la sentencia a la tabla estado para saber el valor del estado segun el id_estado obtenido de la consulta a la tabla trabajador
                const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [datosTrabajador[0].estado]);
                //console.log(rowsTrabajador[0].id_estado);
                //se setea al objeto trabajador el id_tipo de trabajador para obtener el valor y setearlo de nuevo al objeto

                // const [rolTrabajador, fieldTipoTrabajador] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [rowsTrabajador[0].id_rol]);

                //se setea el valor de la consulta al rol del trabajador del objeto
                trabajador.setOcupacion(sql_data_trabajador[0].ocupacion);
                //
                const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
                const [documentos, fieldDocumetos] = await POOL_CONNECTION.execute("SELECT * FROM documentacion WHERE id_trabajador = ?", [datosTrabajador[0].id_trabajador]);
                trabajador.setTypeDocument(tipoDocumento[0].tipo_documento);
                
                trabajador.setFirstNameUser(rowsUser[0].nombres);
                trabajador.setLastNameUser(rowsUser[0].apellidos);
                trabajador.setEmailUser(rowsUser[0].email);
                trabajador.setPhoneNumberUser(rowsUser[0].telefono); 
                trabajador.setNumberDocument(rowsUser[0].numero_documento);
                trabajador.setDateRegister(new Date().getDate());
                trabajador.setAddressUser(rowsUser[0].direccion);
                trabajador.setPictureProfile(rowsUser[0].foto_perfil);
                trabajador.setStateTrabajador(estado[0].estado);
                trabajador.setEspecialidad(datosTrabajador[0].especialidad);
                trabajador.setExperiencia(documentos[0].experiencia);
                trabajador.setOcupacion(datosTrabajador[0].ocupacion);

                console.log(trabajador);
                if(rowsUser.length > 0){
                    res.status(200).send(trabajador);
                }else{
                    res.status(204).send({"error": "Sin Datos"});
                }

            }catch(err){
                console.error('Error: ' + err );
                res.status(500).send({"error": err.message});
            }
        }else{
            res.status(404).send({"error": false});
        }
        closePOOL_CONNECTION(POOL_CONNECTION);  
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function getIdTrabajadorByIdUser(req, res){
    try{
        //se crea el objeto trabajador
        let trabajador = new Trabajador();
        //se introduce el parametro id_trabajador proporcionado mediante el parametro :id del endpoint
        trabajador.setIdUser(req.params.id) //req.params.id --> contiene el id del trabajador y no de la persona
        //console.log(trabajador.getIdTrabajador());
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla trabajador segun el id_trabajador enviado por el parametro :id
        const sql = "SELECT * FROM trabajador WHERE id_persona = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto trabajador id_client  a la sentencia sql
        const [rowsTrabajador, fieldsTrabajador] = await POOL_CONNECTION.execute(sql, [trabajador.getIdUser()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del trabajador
        trabajador.setIdTrabajador(rowsTrabajador[0].id_trabajador);
        
        
        res.status(200).send(trabajador);
        closePOOL_CONNECTION(POOL_CONNECTION);
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllTrabajador(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM empleados";

            const [rowsTrabajador, fieldsTrabajador] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsTrabajador.length; i++) {
                //Se instancia la entidad trabajador
                let trabajador = new Trabajador();
                //sentencia para saber los datos personales del trabajador en la tabla persona
                const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
                
                const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [rowsTrabajador[i].id_persona]);
                // console.log(rowsUser);
                const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [rowsTrabajador[i].id_estado]);
                // console.log(estado);
                const [tipoTrabajador, fieldTipoTrabajador] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [rowsTrabajador[i].id_rol]);
                const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
                
                trabajador.setIdUser(rowsUser[0].id_persona);
                trabajador.setIdTrabajador(rowsTrabajador[0].id_trabajador);
                trabajador.setFirstNameUser(rowsUser[0].nombres);
                trabajador.setLastNameUser(rowsUser[0].apellidos);
                trabajador.setEmailUser(rowsUser[0].email);
                trabajador.setPhoneNumberUser(rowsUser[0].telefono); 
                trabajador.setNumberDocument(rowsUser[0].numero_documento);
                trabajador.setDateRegister(new Date().getDate());
                trabajador.setAddressUser(rowsUser[0].direccion);
                trabajador.setPictureProfile(rowsUser[0].foto_perfil);
                trabajador.setRolTrabajador(tipoTrabajador[0].tipo_trabajador);
                trabajador.setTypeDocument(tipoDocumento[0].tipo_documento);
                trabajador.setStateTrabajador(estado[0].estado);
                
                response.push(trabajador);
                
            }
            res.status(200).send(JSON.stringify(response));
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }
    
        
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }finally{
        closePOOL_CONNECTION(POOL_CONNECTION);
    }
}

async function updateOneTrabajador(req, res){
    //se puede actualizar de la tabla trabajador solo: estado y tipo trabajador
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad trabajador
    let trabajador = new Trabajador();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_trabajador pasado mediante el body de la consulta
            const sql_trabajador_consulta = "SELECT id_persona AS id FROM empleados WHERE id_empleado = ?";
            const [id_persona, fieldsConsulta] = await POOL_CONNECTION.execute(sql_trabajador_consulta,[req.body.id_trabajador]);
            const sql_persona = "UPDATE persona SET nombres = ?, apellidos = ?, telefono = ?, direccion = ?, email = ?, foto_perfil = ?, numero_documento = ? WHERE id_persona = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_persona, [req.body.nombres, req.body.apellidos, req.body.telefono, req.body.direccion, req.body.email, req.body.foto_perfil, req.body.numero_documento, id_persona[0].id]);
            const sql_trabajador = "UPDATE empleados SET id_estado = ?, id_rol = ? WHERE id_empleado = ?";
            await POOL_CONNECTION.execute(sql_trabajador, [req.body.id_estado, req.body.id_rol, req.body.id_trabajador]);
            
            const [tipoTrabajador, fieldTipoTrabajador] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [req.body.id_rol]);
            const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [req.body.id_estado]);

            trabajador.setFirstNameUser(req.body.nombres);
            trabajador.setLastNameUser(req.body.apellidos);
            trabajador.setPhoneNumberUser(req.body.telefono);
            trabajador.setAddressUser(req.body.direccion);
            trabajador.setEmailUser(req.body.email);
            trabajador.setPictureProfile(req.body.foto_perfil);
            trabajador.setNumberDocument(req.body.numero_documento);
            trabajador.setRolTrabajador(tipoTrabajador[0].rol);
            trabajador.setStateTrabajador(estado[0].estado);

            res.status(200).send(JSON.stringify(trabajador));
        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Actualizando datos: ' + err.message);
        }
    }catch(err){
    console.log("Error al actualizar: " + err);
    res.status(500).send(err);
    }finally{
        closePOOL_CONNECTION(POOL_CONNECTION);
    }
}

async function deleteOneTrabajador(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM empleados WHERE id_empleado = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }finally{
        closePOOL_CONNECTION(POOL_CONNECTION);
    }
}

async function deleteAllTrabajador(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM empleados";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }finally{
        closePOOL_CONNECTION(POOL_CONNECTION);
    }
}

function prueba2(req, res){
    res.send("Hello World"); 
    
}


function subirDocumentos(req, res){
    res.send(`D:/Documentos/Microservices_v01/microservices_backend/${req.file.path}`);
    
}

function servirImagenes(req, res){
    var url_img = req.params.id;
    __dirname = path.resolve('');
    res.sendFile(`${__dirname}/src/assets/${url_img}.jpg`)
}

module.exports = {createTrabajador, findOneTrabajador, findAllTrabajador, updateOneTrabajador, deleteOneTrabajador, deleteAllTrabajador,subirDocumentos, getIdTrabajadorByIdUser, servirImagenes}