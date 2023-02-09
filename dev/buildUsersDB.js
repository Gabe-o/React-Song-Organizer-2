import mysql from 'mysql2';

//connects to mySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab4db',
    multipleStatements: true
});

//builds users table template
function buildUsersDB() {

    db.query("DROP TABLE users", (err) => {
        if (err != null) {
            console.log("No table to drop");
        }
    });

    db.query("CREATE TABLE users (id VARCHAR(100) NOT NULL,username VARCHAR(50) NOT NULL,admin VARCHAR(5) NOT NULL,activated VARCHAR(5) NOT NULL,PRIMARY KEY (id));", (err) => {
        if (err != null) {
            console.log("Error creating table!");
        }
    });

    db.query("INSERT INTO users VALUES (?, ?, ?, ?);", ["NOnFENDiSGSNLUzEJFADA0X2zA42", "administrator", "true", "true"], (err) => {
        if (err != null) {
            console.log("Error inserting into table!");
        }
    })
}

buildUsersDB();