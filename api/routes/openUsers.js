require('dotenv').config({ path: '../api/.env' });

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../DBConnect.js');

const openUsersRouter = express.Router();

//gets username
openUsersRouter.get('', (req, res) => {
    db.query("SELECT username FROM users;", (err, data) => {
        console.log(data);
        if (err) {
            res.status(500).json(err);
        }
        else if (data.length === 0) {

            res.json([]);
        }
        else {

            res.json(data);
        }
    });
});

//gets user based on id
openUsersRouter.get("/:id", (req, res) => {
    db.query("SELECT * FROM users WHERE id=?;", [req.params.id], (err, data) => {
        if (err != null) {

            res.send(err);
        }
        else {
            res.json(data);
        }
    })
});

//posts new user in mySQL
openUsersRouter.post('/insert', (req, res) => {

    db.query("INSERT INTO users VALUES (?, ?, ?, ?);", [req.body.id, req.body.username, req.body.administrator, req.body.activated], (err) => {
        res.send(err);
    })
});

// Generates JWT
openUsersRouter.post('/login', (req, res) => {
    const user = { name: req.body.username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    res.json({ accessToken: accessToken })
});

//posts new google user into mySQL
openUsersRouter.post("/insertGoogleUser", (req, res) => {

    let username = req.body.username;

    db.query("SELECT username FROM users;", (err, data) => {
        if (err) {
            console.log(err);
        }

        let c = 1;
        while (true) {
            if (data.some(user => user.username === username)) {
                username = req.body.username + " (" + c + ")";
            }
            else {
                break;
            }
            c++;
        }

        db.query("INSERT INTO users VALUES (?, ?, ?, ?);", [req.body.id, username, "false", "true"], (err) => {
            if (err != null) {
                res.status(500).json(err);
            }
            else {
                res.json(username);
            }
        })
    });
});



module.exports = openUsersRouter;