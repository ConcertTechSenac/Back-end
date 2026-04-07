'use strict'; 

const mysql = require('mysql2/promise')
require('dotenv').config();

const config_db = mysql.createPool({
 host : process.env.DB_HOST,
 port : process.env.DB_PORT,
 user : process.env.DB_USER,
 password : process.env.DB_PASSWORD, 
 database : process.env.DATA_BASE_NAME,
});  


config_db.getConnection((err,connection) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados', err)
    } else {
        console.log('Conectado ao banco com sucesso!')
        connection.release();
    }
})

module.exports = config_db; 