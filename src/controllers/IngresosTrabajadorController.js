const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const IngresosTrabajador = require('../models/IngresosTrabajador');

//Create
async function createIngreso(req, res){
    try {
        //Creacion de ala conexion con la base de datos
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Se instancia un objeto tipo Calificacion
        const ingreso = new IngresosTrabajador();
        const fecha = new Date();
        ingreso.setIdTrabajador(req.body.trabajador);
        ingreso.setIdPago(req.body.pago);
        ingreso.setIdOrden(req.body.orden);
        ingreso.setIdEstado(req.body.estado);
        ingreso.setTotal(req.body.total)
        ingreso.setTotalIngreso(req.body.ingreso);
        ingreso.setFecha(fecha);
        // console.log(`entrada: ${calificacion.getNota()}, ${calificacion.getComentario()}, ${calificacion.getIdEvaluado()}, ${calificacion.getIdEvaluador()}`);
        const sql = "INSERT INTO ingresos_trabajador(id_trabajador, id_orden, id_pago, total, comision, ingreso, id_estado) VALUES (?,?,?,?,?,?,?)";
        const [ingresoRows, ingresoFields] = await POOL_CONNECTION.execute(sql, []);

        if(ingresoRows){
            res.status(200).send(ingreso);
        }
        console.log(ingresoRows);
        closePOOL_CONNECTION();
    } catch (error) {
        console.log(error);
    }

}
//Read
async function findAllIngresos(){
    
}
async function findIngresoByIdByState(req, res){

    try {
        var ingresoTotal = 0;
        //Creacion de ala conexion con la base de datos
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Se instancia un objeto tipo Calificacion
        const ingreso = new IngresosTrabajador();
        const sql = "SELECT * FROM ingresos_trabajador WHERE id_trabajador = ? AND id_estado = ?"
        const [ingresosRows, calificacionFields] = await POOL_CONNECTION.execute(sql, [req.params.id, req.params.state]);
        for (let i = 0; i < ingresosRows.length; i++) {
            ingresoTotal = ingresoTotal + ingresosRows[i].total;
        }
        console.log(ingresosRows);
        res.status(200).send({"totalIngresos": ingresoTotal})
    } catch (error) {
        console.log(error);
    }
}

//Update
async function updateCalificacion(){
    
}
//Delete
async function deleteCalificacion(){
    
}

module.exports = {createIngreso, findIngresoByIdByState}