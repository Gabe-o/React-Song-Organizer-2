//all necessary requires
const express = require('express');
const db = require('../DBConnect.js');
const fs = require("fs");

//sets up router
const adminRouter = express.Router();

//get request for all usernames from mySQL
adminRouter.get('/usernames', (req, res) => {
    db.query("SELECT * FROM users;", (err, data) => {
        if (err) { //if error, return 500 error
            res.status(500).json(err);
        }
        else if (data.length === 0) { //if no usernames are returned, return 404 error
            res.status(404).json("No Users Found!");
        }
        else { //else, return data
            res.json(data);
        }
    });
});

//post request to toggle user as admin in mySQL
adminRouter.post('/update/admin', (req, res) => {
    db.query("UPDATE users SET admin=? WHERE id=?;", [req.body.admin, req.body.id], (err) => {
        if (err != null) { //if error, return 500 error
            res.status(500).json(err);
        }
        res.status(200).json("Success"); //else, return success
    });
});

//post request to toggle user as activated in mySQL
adminRouter.post('/update/activation', (req, res) => {
    db.query("UPDATE users SET activated=? WHERE id=?;", [req.body.activation, req.body.id], (err) => {
        if (err != null) { //if error, return 500 error
            res.status(500).json(err);
        }
        res.status(200).json("Success"); //else, return success
    });
});

//post request to toggle review as hidden in mySQL
adminRouter.post('/update/review', (req, res) => {
    db.query("UPDATE reviews SET hidden=? WHERE reviewId=?", [req.body.hidden, req.body.reviewId], (err) => {
        if (err != null) { //if error, return 500 error
            res.status(500).json(err);
        }
        else { //else, return success
            res.json("Success");
        }
    })
})

//get request to get reviews for a playlist
adminRouter.get("/review/:id", (req, res) => {
    db.query("SELECT reviews.reviewId, reviews.playlistId, reviews.name, reviews.user, users.username, reviews.rating, reviews.review, reviews.hidden, reviews.date FROM reviews LEFT JOIN users ON reviews.user=users.id WHERE playlistId=?;", [req.params.id], (err, data) => {
        if (err != null) { //if error, return 500 error
            res.json(err);
        }
        else { //else, return review
            res.json(data);
        }
    })
});

//post request to update privacyPolicy
adminRouter.post("/update/privacyPolicy", (req, res) => {
    fs.writeFile("../api/policies/privacyPolicy.txt", req.body.html, (err) => {
        if (err != null) { //if error, return 500 error
            res.json("Error");
        }
        else { //else, return success
            res.json("Success");
        }

    })
});

//same as update privacyPolicy
adminRouter.post("/update/takedownPolicy", (req, res) => {
    fs.writeFile("../api/policies/takedownPolicy.txt", req.body.html, (err) => {
        if (err != null) {
            res.json("Error");
        }
        else {
            res.json("Success");
        }
    })

});

//same as update privacyPolicy
adminRouter.post("/update/acceptableUsePolicy", (req, res) => {
    fs.writeFile("../api/policies/acceptableUsePolicy.txt", req.body.html, (err) => {
        if (err != null) {
            res.json("Error");
        }
        else {
            res.json("Success");
        }
    })
});

//post request to takedown request for review
adminRouter.post("/update/takedown/:id", (req, res) => {
    db.query("UPDATE reviews SET takedown=? WHERE reviewId=?", [req.body.takedown, req.params.id], (err) => {
        if (err != null) { //if error, then return 500 error
            res.status(500).json(err);
        }
        else { //else, return success
            res.json("Success");
        }
    })
});

//same as takedown request for review infringement
adminRouter.post("/update/infringement/:id", (req, res) => {
    db.query("UPDATE reviews SET infringement=? WHERE reviewId=?", [req.body.infringement, req.params.id], (err) => {
        if (err != null) {
            res.status(500).json(err);
        }
        else {
            res.json("Success");
        }
    })
});

//same as takedown request for review dispute
adminRouter.post("/update/dispute/:id", (req, res) => {
    db.query("UPDATE reviews SET dispute=? WHERE reviewId=?", [req.body.dispute, req.params.id], (err) => {
        if (err != null) {
            res.status(500).json(err);
        }
        else {
            res.json("Success");
        }
    })
});

//get request for all dcma disputes for a playlist
adminRouter.get("/dcma/:id", (req, res) => {
    db.query("SELECT takedown, infringement, dispute FROM reviews WHERE reviewId=?", [req.params.id], (err, data) => {
        if (err != null) {
            res.status(500).json(err);
        }
        else {
            res.json(data);
        }
    })
})

module.exports = adminRouter;