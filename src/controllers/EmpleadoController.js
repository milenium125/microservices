const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Employee = require('../models/Empleado');

async function createEmployee(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        console.log(req.body);
        //creacion del objeto employee
        let employee = new Employee();
        //Usuario.setIdUser();
        //set de los datos enviados por el body de la peticion al objeto construido
        employee.setFirstNameUser(req.body.name);
        employee.setLastNameUser(req.body.lastname);
        employee.setEmailUser(req.body.email);
        employee.setPhoneNumberUser(req.body.phonenumber);
        employee.setTypeDocument(req.body.type_dni);
        employee.setNumberDocument(req.body.dni);
        employee.setDateRegister(new Date());
        employee.setAddressUser(req.body.address);
        employee.setPictureProfile(req.body.picture_profile);

        //sentencia sql para insertar una nueva persona, esto es previo a la creacion del employee
        const sql = "INSERT INTO persona (nombres, apellidos, telefono, direccion, email, foto_perfil, numero_documento, id_tipo_documento) VALUES (?,?,?,?,?,?,?,?);";

        //creacion del arry con los argumentos de la peticion (prepared statement)
        const inserts = [
            employee.getFirstNameUser(),
            employee.getLastNameUser(),
            employee.getPhoneNumberUser(),
            employee.getAddressUser(),
            employee.getEmailUser(),
            employee.getPictureProfile(),
            employee.getNumberDocument(),
            employee.getTypeDocument()
        ];
        // console.log(employee);
        try{
            //ejecucion de la sentencia de registro de la persona
            const result_user = await POOL_CONNECTION.execute(sql, inserts);
            //console.log("test")
            //ejecucion de la sentencia para saber el id_persona del ultimo registro
            const [rows, fields] = await POOL_CONNECTION.execute("SELECT id_persona AS id FROM persona WHERE numero_documento = ?", [employee.getNumberDocument()]);
            //console.log(rows);
            //en este if se verifica si en la consulta hay almenos un registro para poder proceder
            if (rows.length > 0) {
                employee.setIdUser(rows[0].id); // Accede al valor directamente
                console.log("ID del registro insertado: " + employee.getIdUser());
            } else {
                console.error("No se encontró ningún ID.");
            }
            employee.setStateEmployee(3); //estado por defecto que es el de verificar, una vez el employee verifica sus datos pasa a estado activo
            employee.setRolEmployee(1); //este tipo de employee debe venir definido en el body de la peticion, con el fin de crear employees standard o premium segun se desee
            //sentencia sql para registrar un nuevo employee
            let sql_employee = "INSERT INTO empleados (id_rol, id_persona, id_estado) VALUES (?, ?, ?) ";
            //creacion del array para setear los valores en la sentencia (prepared statement)

            let inserts_employee = [
                employee.getRolEmployee(),
                employee.getIdUser(),
                employee.getStateEmployee(),
            ];
            //ejecucion de la sentencia para registrar un nuevo employee
            const result_Employee = await POOL_CONNECTION.execute(sql_employee, inserts_employee);
            console.log('Employee Insert Successfully');
            //console.log(result_user);
            //devolucion del objeto employee al employee de la API
            console.log(employee);
            res.send('Data Insert Successfully: ' + JSON.stringify(employee));
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

async function findOneEmployee(req, res){
    try{
        //se crea el objeto employee
        let employee = new Employee();
        //se introduce el parametro id_employee proporcionado mediante el parametro :id del endpoint
        employee.setIdEmployee(req.params.id)
        //console.log(employee.getIdEmployee());
        //Obtener conexion a la BBDD
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Sentencia para obtener los datos de la tabla employee segun el id_employee enviado por el parametro :id
        const sql = "SELECT * FROM empleados WHERE id_empleado = ?";
        //se ejecuta la sentencia y se setea el parametro del objeto employee id_client  a la sentencia sql
        const [rowsEmployee, fieldsEmployee] = await POOL_CONNECTION.execute(sql, [employee.getIdEmployee()]);
        //se define sentencia sql para consultar el registro de la tabla persona, para tener los datos personales del employee
        const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
        try{
            
            //se setea el parametro de id_persona obtenido de la consulta sql a la tabla employee
            employee.setIdUser(rowsEmployee[0].id_persona);
            //console.log(employee.getIdUser());
            //se ejecuta consulta a la tabla persona para obtener los datos personales, el resultado se guarda en rowUser
            const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [employee.getIdUser()]);
            //se ejecuta la sentencia a la tabla estado para saber el valor del estado segun el id_estado obtenido de la consulta a la tabla employee
            const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [rowsEmployee[0].id_estado]);
            //console.log(rowsEmployee[0].id_estado);
            //se setea al objeto employee el id_tipo de employee para obtener el valor y setearlo de nuevo al objeto
            const [rolEmployee, fieldTipoEmployee] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [rowsEmployee[0].id_rol]);
            //se setea el valor de la consulta al rol del employee del objeto
            employee.setRolEmployee(rolEmployee[0].rol);
            //
            const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
            employee.setTypeDocument(tipoDocumento[0].tipo_documento);
            
            employee.setFirstNameUser(rowsUser[0].nombres);
            employee.setLastNameUser(rowsUser[0].apellidos);
            employee.setEmailUser(rowsUser[0].email);
            employee.setPhoneNumberUser(rowsUser[0].telefono); 
            employee.setNumberDocument(rowsUser[0].numero_documento);
            employee.setDateRegister(new Date().getDate());
            employee.setAddressUser(rowsUser[0].direccion);
            employee.setPictureProfile(rowsUser[0].foto_perfil);
            employee.setStateEmployee(estado[0].estado);

        }catch(err){
            console.error('Error: ' + err );
            res.status(500).send('Error al Encontrar datos: ' + err.message);
        }finally{
            closePOOL_CONNECTION(POOL_CONNECTION);
        }
        res.status(200).send("Objeto: "+JSON.stringify(employee));
    }catch(err){
        console.error('Error: ' + err);
        res.status(500).send('Error inesperado en el servidor');
    }
}

async function findAllEmployee(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        try{
            const sql = "SELECT * FROM empleados";

            const [rowsEmployee, fieldsEmployee] = await POOL_CONNECTION.execute(sql);

            var response = [];

            for (let i = 0; i < rowsEmployee.length; i++) {
                //Se instancia la entidad employee
                let employee = new Employee();
                //sentencia para saber los datos personales del employee en la tabla persona
                const sql_data_user = "SELECT * FROM persona WHERE id_persona = ?";
                
                const [rowsUser, fieldsUser] = await POOL_CONNECTION.execute(sql_data_user, [rowsEmployee[i].id_persona]);
                // console.log(rowsUser);
                const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [rowsEmployee[i].id_estado]);
                // console.log(estado);
                const [tipoEmployee, fieldTipoEmployee] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [rowsEmployee[i].id_rol]);
                const [tipoDocumento, fieldTipoDocumeto] = await POOL_CONNECTION.execute("SELECT * FROM tipo_documento WHERE id_tipo_documento = ?", [rowsUser[0].id_tipo_documento]);
                
                employee.setIdUser(rowsUser[0].id_persona);
                employee.setIdEmployee(rowsEmployee[0].id_employee);
                employee.setFirstNameUser(rowsUser[0].nombres);
                employee.setLastNameUser(rowsUser[0].apellidos);
                employee.setEmailUser(rowsUser[0].email);
                employee.setPhoneNumberUser(rowsUser[0].telefono); 
                employee.setNumberDocument(rowsUser[0].numero_documento);
                employee.setDateRegister(new Date().getDate());
                employee.setAddressUser(rowsUser[0].direccion);
                employee.setPictureProfile(rowsUser[0].foto_perfil);
                employee.setRolEmployee(tipoEmployee[0].tipo_employee);
                employee.setTypeDocument(tipoDocumento[0].tipo_documento);
                employee.setStateEmployee(estado[0].estado);
                
                response.push(employee);
                
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

async function updateOneEmployee(req, res){
    //se puede actualizar de la tabla employee solo: estado y tipo employee
    //se puede actualizar de la clase persona solo: nombres, apellidos, telefono, direccion, email, foto de perfil, numero de docuemnto
   try{
    //Se instancia la entidad employee
    let employee = new Employee();
    console.log(req.body);
    const POOL_CONNECTION = await createPOOL_CONNECTION();
        try{
        //Sentencia para saber el id_persona segun el id_employee pasado mediante el body de la consulta
            const sql_employee_consulta = "SELECT id_persona AS id FROM empleados WHERE id_empleado = ?";
            const [id_persona, fieldsConsulta] = await POOL_CONNECTION.execute(sql_employee_consulta,[req.body.id_employee]);
            const sql_persona = "UPDATE persona SET nombres = ?, apellidos = ?, telefono = ?, direccion = ?, email = ?, foto_perfil = ?, numero_documento = ? WHERE id_persona = ?";
            const [updateData, fieldsUpdate] = await POOL_CONNECTION.execute(sql_persona, [req.body.nombres, req.body.apellidos, req.body.telefono, req.body.direccion, req.body.email, req.body.foto_perfil, req.body.numero_documento, id_persona[0].id]);
            const sql_employee = "UPDATE empleados SET id_estado = ?, id_rol = ? WHERE id_empleado = ?";
            await POOL_CONNECTION.execute(sql_employee, [req.body.id_estado, req.body.id_rol, req.body.id_employee]);
            
            const [tipoEmployee, fieldTipoEmployee] = await POOL_CONNECTION.execute("SELECT * FROM rol WHERE id_rol = ?", [req.body.id_rol]);
            const [estado, fieldState] = await POOL_CONNECTION.execute("SELECT * FROM estado WHERE id_estado = ?", [req.body.id_estado]);

            employee.setFirstNameUser(req.body.nombres);
            employee.setLastNameUser(req.body.apellidos);
            employee.setPhoneNumberUser(req.body.telefono);
            employee.setAddressUser(req.body.direccion);
            employee.setEmailUser(req.body.email);
            employee.setPictureProfile(req.body.foto_perfil);
            employee.setNumberDocument(req.body.numero_documento);
            employee.setRolEmployee(tipoEmployee[0].rol);
            employee.setStateEmployee(estado[0].estado);

            res.status(200).send(JSON.stringify(employee));
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

async function deleteOneEmployee(req, res){
    try{
        console.log(req.params.id)
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM empleados WHERE id_empleado = ?";

        POOL_CONNECTION.execute(sql, [req.params.id]);

        res.send("Registro "+req.params.id+" eliminado correctamente");
    }catch(err){
        console.log(`Error al Eliminar el id: ${req.params.id} | ` + err);
        res.status(500).send(err);
    }
}

async function deleteAllEmployee(req, res){
    try{
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const sql = "DELETE FROM empleados";

        POOL_CONNECTION.execute(sql);

        res.send("Todos los registros han sido eliminados correctamente");
    }catch(err){
        console.log("Error al Eliminar todos los registros: " + err);
        res.status(500).send(err);
    }
}

function prueba2(req, res){
    res.send("Hello World"); 
    
}

module.exports = {createEmployee, prueba2, findOneEmployee, findAllEmployee, updateOneEmployee, deleteOneEmployee, deleteAllEmployee}