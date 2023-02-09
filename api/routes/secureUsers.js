const express = require('express');
const db = require('../DBConnect.js');

const secureUsersRouter = express.Router();

//updates user's username
secureUsersRouter.put('/update/:id', (req, res) => {
    db.query("UPDATE users SET username=? WHERE id=?;", [req.body.username, req.params.id], (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (data.length === 0) {
            res.status(404).json("No Users Found!");
        }
        else {
            res.json(data);
        }
    });
});





module.exports = secureUsersRouter;