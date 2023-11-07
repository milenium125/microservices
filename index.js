const Empleado = require('./src/models/Empleado');
const app = require('./src/routes/routes');
// const bodyParser = require('body-parser');

// app.use(bodyParser.json()) ;// for parsing application/json

const port = 3200;

// let empleado1 = new Empleado(1, 'David', 'Sanmiguel', 'prueba01@gmail.com', '3224282443', 'Cedula de ciudadania', '1095821098', '20-10-2023', 'Carrera 15 # 53 - 43', 'none', 1, 'En proceso', 'Trabajador');
// console.log(empleado1);

app.listen(port, () => {
    console.log(`server running in port ${port}`);
});
