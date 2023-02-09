import mysql from 'mysql2';

//connects to mySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab4db',
    multipleStatements: true
});

//builds reviews table template
function buildReviewsDB() {

    db.query("DROP TABLE reviews", (err) => {
        if (err != null) {
            console.log("No table to drop");
        }
    });

    db.query("CREATE TABLE reviews (reviewId INT NOT NULL AUTO_INCREMENT,playlistId INT NOT NULL,name VARCHAR(45) NOT NULL,user VARCHAR(45) NOT NULL,rating INT NOT NULL,review TEXT NOT NULL,hidden VARCHAR(5) NOT NULL, date VARCHAR(45) NOT NULL,takedown VARCHAR(45),infringement VARCHAR(45),dispute VARCHAR(45), PRIMARY KEY (reviewId));", (err) => {
        if (err != null) {
            console.log("Error creating table!");
        }
    });
}

buildReviewsDB();