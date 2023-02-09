const mysql = require('mysql2');

// Stores MySQL connection information
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab4db'
});

module.exports = conn;