const app = require('../app');
const bodyParser = require('body-parser');
const multer = require('multer');

var jsonParser = bodyParser.json();

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/cedulas');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+".jpg");
    }
})
var storage2 = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/diplomas');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+".jpg");
    }
})
const upload = multer({storage:storage});
const upload2 = multer({storage:storage2});

const {prueba, createCustomer, findOneCustomer, findAllCustomer, updateOneCustomer, deleteOneCustomer, deleteAllCustomer, findOneClient} = require('../controllers/ClienteController');
const {prueba2, createEmployee, findOneEmployee, findAllEmployee, updateOneEmployee, deleteOneEmployee, deleteAllEmployee} = require('../controllers/EmpleadoController');
const {prueba3, createConversation, findOneConversation, findAllConversation, updateOneConversation, deleteOneConversation, deleteAllConversation} = require('../controllers/ConversacionController');
const {prueba4, createLogin, findOneLogin, findAllLogin, updateOneLogin, deleteOneLogin, deleteAllLogin, findOneUser, thereIsAnyUser} = require('../controllers/LoginController');
const {prueba5, createMessage, findOneMessage, findAllMessage, updateOneMessage, deleteOneMessage, deleteAllMessage} = require('../controllers/MensajeController');
const {prueba6, createService, findOneService, findAllService, updateOneService, deleteOneService, deleteAllService,findAllServiceAvailables, findAllTrabajadorBySevices} = require('../controllers/ServicioController');
const {createServiceSolicitud, findOneServiceSolicitud, findAllServiceSolicitud, updateOneServiceSolicitud, deleteOneServiceSolicitud, deleteAllServiceSolicitud, findOneServiceSolicitudByIdSolicitud} = require('../controllers/ServicioSolicitudController');
const {createServiceTrabajador, findOneServiceTrabajador, findAllServiceTrabajador, updateOneServiceTrabajador, deleteOneServiceTrabajador, deleteAllServiceTrabajador, findOneServiceTrabajadorByIdTrabajador} = require('../controllers/ServicioTrabajadorController');
const {prueba7, createRequest, findOneRequest, findAllRequest, updateOneRequest, deleteOneRequest, deleteAllRequest, findOneRequestByState, findOneRequestByStateTrabajador, updateOneRequestByState} = require('../controllers/SolicitudController'); 
const {prueba8, createPayment, findOnePayment, findAllPayment, updateOnePayment, deleteOnePayment, deleteAllPayment} = require('../controllers/PagoController');
const {createTrabajador, findOneTrabajador, findAllTrabajador, updateOneTrabajador, deleteOneTrabajador, deleteAllTrabajador, subirDocumentos, getIdTrabajadorByIdUser, servirImagenes} = require('../controllers/TrabajadorController');
const {createNewChat, getChatsbySolicitud} = require("../controllers/ChatController");

app.get('/',  prueba);
// CRUD Customer
app.post('/api/client/create',jsonParser,  createCustomer);
app.get('/api/client/find/:id', findOneCustomer);
app.get('/api/client/find/user/:id', findOneClient);
app.get("/api/client/find", findAllCustomer);
app.put("/api/client/update",jsonParser , updateOneCustomer);
app.delete("/api/client/delete/:id", deleteOneCustomer);
app.delete("/api/client/delete", deleteAllCustomer);

//CRUD Employee
app.post('/api/employee/create',jsonParser,  createEmployee);
app.get('/api/employee/find/:id', findOneEmployee);
app.get("/api/employee/find", findAllEmployee);
app.put("/api/employee/update",jsonParser , updateOneEmployee);
app.delete("/api/employee/delete/:id", deleteOneEmployee);
app.delete("/api/employee/delete", deleteAllEmployee);

//CRUD Conversation
app.post('/api/conversation/create',jsonParser,  createConversation);
app.get('/api/conversation/find/:id', findOneConversation);
app.get("/api/conversation/find", findAllConversation);
app.put("/api/conversation/update",jsonParser , updateOneConversation);
app.delete("/api/conversation/delete/:id", deleteOneConversation);
app.delete("/api/conversation/delete", deleteAllConversation);

//CRUD Login
app.post('/api/login/create',jsonParser,  createLogin);
app.post('/api/login/find/login',jsonParser , findOneUser);
app.get('/api/login/find/:id', findOneLogin);
app.get("/api/login/find", findAllLogin);
app.get("/api/login/find", findAllLogin);
app.put("/api/login/update",jsonParser , updateOneLogin);
app.delete("/api/login/delete/:id", deleteOneLogin);
app.delete("/api/login/delete", deleteAllLogin);

//CRUD Mensaje
app.post('/api/message/create',jsonParser,  createMessage);
app.get('/api/message/find/:id', findOneMessage);
app.get("/api/message/find", findAllMessage);
app.put("/api/message/update",jsonParser , updateOneMessage);
app.delete("/api/message/delete/:id", deleteOneMessage);
app.delete("/api/message/delete", deleteAllMessage);

//CRUD Servicio
app.post('/api/service/create',jsonParser,  createService);
app.get('/api/service/find/:id', findOneService);
app.get("/api/service/find", findAllService);
app.put("/api/service/update",jsonParser , updateOneService);
app.delete("/api/service/delete/:id", deleteOneService);
app.delete("/api/service/delete", deleteAllService);
app.get("/api/service/available", findAllServiceAvailables);
app.get("/api/service/trabajador/:id", findAllTrabajadorBySevices); 

//CRUD ServicioSolicitud
app.post('/api/service-solicitud/create',jsonParser,  createServiceSolicitud);
app.get('/api/service-solicitud/find/:id', findOneServiceSolicitud);
app.get("/api/service-solicitud/find", findAllServiceSolicitud);
app.put("/api/service-solicitud/update",jsonParser , updateOneServiceSolicitud);
app.delete("/api/service-solicitud/delete/:id", deleteOneServiceSolicitud);
app.delete("/api/service-solicitud/delete", deleteAllServiceSolicitud); 
app.get("/api/service-solicitud/find/solicitud/:id", findOneServiceSolicitudByIdSolicitud);

app.post('/api/service-trabajador/create',jsonParser,  createServiceTrabajador);
app.get('/api/service-trabajador/find/:id', findOneServiceTrabajador);
app.get("/api/service-trabajador/find", findAllServiceTrabajador);
app.put("/api/service-trabajador/update",jsonParser , updateOneServiceTrabajador);
app.delete("/api/service-trabajador/delete/:id", deleteOneServiceTrabajador);
app.delete("/api/service-trabajador/delete", deleteAllServiceTrabajador); 
app.get("/api/service-trabajador/find/solicitud/:id", findOneServiceTrabajadorByIdTrabajador);

//CRUD Solicitud
app.post('/api/request/create',jsonParser,  createRequest);
app.post("/api/request/find",jsonParser, findOneRequestByState);
app.post("/api/request/find/estado",jsonParser, updateOneRequestByState);
app.get('/api/request/find/:id', findOneRequest);
app.get("/api/request/find", findAllRequest);
app.put("/api/request/update",jsonParser , updateOneRequest);
app.delete("/api/request/delete/:id", deleteOneRequest);
app.delete("/api/request/delete", deleteAllRequest); findOneRequestByStateTrabajador
app.post("/api/request/find/trabajador", jsonParser, findOneRequestByStateTrabajador);


//CRUD Pago
app.post('/api/payment/create',jsonParser,  createPayment);
app.get('/api/payment/find/:id', findOnePayment);
app.get("/api/payment/find", findAllPayment);
app.put("/api/payment/update",jsonParser , updateOnePayment);
app.delete("/api/payment/delete/:id", deleteOnePayment);
app.delete("/api/payment/delete", deleteAllPayment);

//CRUD Trabajador
app.post('/api/trabajador/create',jsonParser,  createTrabajador);
app.get('/api/trabajador/find/:id', findOneTrabajador);
app.get("/api/trabajador/find", findAllTrabajador);
app.post('/subir/cedula', upload.single('cedula'), subirDocumentos);
app.post('/subir/diploma', upload2.single('diploma'), subirDocumentos);
app.put("/api/trabajador/update",jsonParser , updateOneTrabajador);
app.delete("/api/trabajador/delete/:id", deleteOneTrabajador);
app.delete("/api/trabajador/delete", deleteAllTrabajador);getIdTrabajadorByIdUser
app.get("/api/trabajador/find/persona/:id", getIdTrabajadorByIdUser);
app.get("/api/img/:id", servirImagenes);

//CRUD CHAT
app.post('/api/chat/create',jsonParser,  createNewChat);
app.get('/api/chat/find/:solicitud', getChatsbySolicitud);
// app.get("/api/payment/find", findAllPayment);
// app.put("/api/payment/update",jsonParser , updateOnePayment);
// app.delete("/api/payment/delete/:id", deleteOnePayment);
// app.delete("/api/payment/delete", deleteAllPayment);

module.exports = app;