const MYSQL = require('mysql2/promise');
const bluebird = require('bluebird');

const HOST = '127.0.0.1';
const USER = 'root';
const PASSWORD = '';
const DATABASE = 'microservices_app_v01'

var POOL_CONNECTION = MYSQL.createPool(
    {
    connectionLimit: 10,
    host : HOST,
    user : USER,
    password : PASSWORD,
    database: DATABASE,
    stringifyObjects: true, 
    Promise: bluebird
});

const createPOOL_CONNECTION = async () => {
    
    return POOL_CONNECTION;
}


function closePOOL_CONNECTION(connection){
    if(connection){
        connection.releaseConnection();
    }
}



module.exports = {createPOOL_CONNECTION, closePOOL_CONNECTION};

