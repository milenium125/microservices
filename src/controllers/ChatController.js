const Chat = require('../models/Chat');
const {createPOOL_CONNECTION, closePOOL_CONNECTION} = require('../config/database');
const { route } = require('../app');

async function createNewChat(req, res){
    try {
        const POOL_CONNECTION = await createPOOL_CONNECTION();

        const chatAtencion = new Chat();
        var fechaCreacion = new Date().getTime();
        var estado = 1;
        const sqlAgentes = "SELECT DISTINCT id_empleado FROM empleados WHERE id_rol = 1";
        const [rowsAgentes,  fieldsAgentes] = await POOL_CONNECTION.execute(sqlAgentes);
        console.log(rowsAgentes);
        const sql = "SELECT id_empleado, COUNT(*) AS total_conversaciones FROM conversacion_atencion_trabajador WHERE estado = 1 GROUP BY id_empleado;";
        const [rowsChats,  fieldsChat] = await POOL_CONNECTION.execute(sql);
        console.log(rowsChats);
        var id_empleado = 0;
        for (let i = 0; i < rowsAgentes.length; i++) {
            for (let j = 0; j < rowsChats.length; j++) {
                
                if(rowsAgentes[i].id_empleado === rowsChats[j].id_empleado){
                    
                    if(rowsChats[j].total_conversaciones < 3){
                        id_empleado = rowsAgentes[i].id_empleado;
                        j = rowsChats.length;
                        i = rowsAgentes.length;
                    } 
                } 
                
            }
    
        }

        chatAtencion.setIdSolicitud(req.body.solicitud);
        chatAtencion.setIdTrabajador(req.body.trabajador);
        chatAtencion.setIdEmpleado(id_empleado);
        chatAtencion.setFechaInicio(new Date().toLocaleDateString());

        var sqlCreate = "INSERT INTO conversacion_atencion_trabajador(id_trabajador, id_empleado, id_solicitud, estado, fecha_inicio) VALUES (?,?,?,?,?)";
        console.log(`${req.body.trabajador}, ${id_empleado}, ${req.body.solicitud}, ${estado}, ${chatAtencion.getFechaInicio()}, ${chatAtencion.getFechaFinal()}`);
        const [rowsCreate, fieldsCreate] = await POOL_CONNECTION.execute(sqlCreate, [req.body.trabajador, id_empleado, req.body.solicitud, estado, chatAtencion.getFechaInicio()]);
        res.status(200).send(chatAtencion);
        closePOOL_CONNECTION();
    } catch (error) {
        res.status(400).send("Agentes no disponibles, espere un momentoa para ser atendido por un agente");
        console.log(error);
        closePOOL_CONNECTION();
    }
}

async function getChatsbySolicitud(req, res){
    try {
        const POOL_CONNECTION = await createPOOL_CONNECTION();
        const chatAtencion = new Chat();

        let solicitud = req.params.solicitud;
        sql = "SELECT * FROM comversacion_atencion_trabajador WHERE id_solicitud = ?";
        const [rowsSolicitud, fieldsSolicitud] = POOL_CONNECTION.execute(sql, [solicitud]);
        if(rowsSolicitud[0]){
            chatAtencion.setIdChat(rowsSolicitud[0].id_chat);
            chatAtencion.setIdEmpleado(rowsSolicitud[0].id_empleado);
            chatAtencion.setIdTrabajador(rowsSolicitud[0].id_trabajador);
            chatAtencion.setIdSolicitud(rowsSolicitud[0].id_solicitud);
            chatAtencion.setFechaInicio(rowsSolicitud[0].fecha_inicio);
            chatAtencion.setFechaFinal(rowsSolicitud[0].fecha_final);
            chatAtencion.setEstadoChat(rowsSolicitud[0].id_estado);
            res.status(200).res(chatAtencion);
        }else{
            res.status(200).res(undefined);
        }
    } catch (error) {
        console.log(error);
    }finally{
        POOL_CONNECTION.closePOOL_CONNECTION();
    }
}

function getAllChatsbyAgent(){

}

function getAllChatsbyWorker(){

}

module.exports = {createNewChat, getChatsbySolicitud}