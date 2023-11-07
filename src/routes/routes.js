const app = require('../app');
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

const {prueba, createCustomer, findOneCustomer, findAllCustomer, updateOneCustomer, deleteOneCustomer, deleteAllCustomer} = require('../controllers/ClienteController');
const {prueba2, createEmployee, findOneEmployee, findAllEmployee, updateOneEmployee, deleteOneEmployee, deleteAllEmployee} = require('../controllers/EmpleadoController');
const {prueba3, createConversation, findOneConversation, findAllConversation, updateOneConversation, deleteOneConversation, deleteAllConversation} = require('../controllers/ConversacionController');
const {prueba4, createLogin, findOneLogin, findAllLogin, updateOneLogin, deleteOneLogin, deleteAllLogin} = require('../controllers/LoginController');
const {prueba5, createMessage, findOneMessage, findAllMessage, updateOneMessage, deleteOneMessage, deleteAllMessage} = require('../controllers/MensajeController');
const {prueba6, createService, findOneService, findAllService, updateOneService, deleteOneService, deleteAllService} = require('../controllers/ServicioController');
const {prueba7, createRequest, findOneRequest, findAllRequest, updateOneRequest, deleteOneRequest, deleteAllRequest} = require('../controllers/SolicitudController'); 
const {prueba8, createPayment, findOnePayment, findAllPayment, updateOnePayment, deleteOnePayment, deleteAllPayment} = require('../controllers/PagoController');

app.get('/',  prueba);
// CRUD Customer
app.post('/api/client/create',jsonParser,  createCustomer);
app.get('/api/client/find/:id', findOneCustomer);
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
app.get('/api/login/find/:id', findOneLogin);
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

//CRUD Solicitud
app.post('/api/request/create',jsonParser,  createRequest);
app.get('/api/request/find/:id', findOneRequest);
app.get("/api/request/find", findAllRequest);
app.put("/api/request/update",jsonParser , updateOneRequest);
app.delete("/api/request/delete/:id", deleteOneRequest);
app.delete("/api/request/delete", deleteAllRequest);

//CRUD Pago
app.post('/api/payment/create',jsonParser,  createPayment);
app.get('/api/payment/find/:id', findOnePayment);
app.get("/api/payment/find", findAllPayment);
app.put("/api/payment/update",jsonParser , updateOnePayment);
app.delete("/api/payment/delete/:id", deleteOnePayment);
app.delete("/api/payment/delete", deleteAllPayment);

module.exports = app;