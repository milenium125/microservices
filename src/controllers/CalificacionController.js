const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const Calificacion = require('../models/Calificacion');

//Create
async function createCalificacion(req, res){
    try {
        //Creacion de ala conexion con la base de datos
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Se instancia un objeto tipo Calificacion
        const calificacion = new Calificacion();
        calificacion.setNota(req.body.nota);
        calificacion.setComentario(req.body.comentario);
        calificacion.setIdEvaluado(req.body.evaluado);
        calificacion.setIdEvaluador(req.body.evaluador);
        console.log(`entrada: ${calificacion.getNota()}, ${calificacion.getComentario()}, ${calificacion.getIdEvaluado()}, ${calificacion.getIdEvaluador()}`);
        const sql = "INSERT INTO calificacion_usuario(nota, comentario, id_Evaluado, id_evaluador) VALUES (?,?,?,?)";
        const [calificacionRows, calificacionFields] = await POOL_CONNECTION.execute(sql, [calificacion.getNota(), calificacion.getComentario(), calificacion.getIdEvaluado(), calificacion.getIdEvaluador()]);

        if(calificacionRows){
            res.status(200).send(calificacion);
        }
        console.log(calificacionRows);
        closePOOL_CONNECTION();
    } catch (error) {
        console.log(error);
    }

}
//Read
async function findAllCalificacionesById(){
    
}
async function findPromedioById(req, res){

    try {
        var calificacionPromedio = 0;
        //Creacion de ala conexion con la base de datos
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        //Se instancia un objeto tipo Calificacion
        const calificacion = new Calificacion();
        const sql = "SELECT * FROM calificacion_usuario WHERE id_evaluado = ?"
        const [calificacionRows, calificacionFields] = await POOL_CONNECTION.execute(sql, [req.params.id]);
        for (let i = 0; i < calificacionRows.length; i++) {
            calificacionPromedio = calificacionPromedio + calificacionRows[i].nota;
        }
        calificacionPromedio = calificacionPromedio / calificacionRows.length ;
        console.log(calificacionRows);
        res.status(200).send(JSON.stringify({"calificacionPromedio": calificacionPromedio}));

        closePOOL_CONNECTION();
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

module.exports = {createCalificacion, findPromedioById}