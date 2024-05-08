const express = require("express");
const app = express();
const cors = require('cors'); // Importa el módulo cors


app.use(cors());
app.use(express.static('assets'));
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (IE11) pueden no devolver status 204
  };
module.exports = app;