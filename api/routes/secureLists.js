const express = require('express');

const db = require('../DBConnect.js');

const secureListRouter = express.Router();

// Create a new list with a given list name.
secureListRouter.post('', (req, res) => {

    // Counts the playlist of the user who sent the request to check if they have made up to 20 playlists
    db.query("SELECT COUNT(id) AS count FROM playlists WHERE user=?",
        [
            req.body.user
        ],
        (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            else if (data[0].count >= 20) {
                res.status(400).json("You may only create up to 20 playlists");
            }
            else {
                // Creates the playlist as long as the user doesn't have more than 20 palylists
                db.query("INSERT INTO playlists (name, user, tracks, lastModified, numTracks, playtime) VALUES (?, ?, ?, ?, ?, ?);",
                    [
                        req.body.name,
                        req.body.user,
                        req.body.tracks,
                        req.body.lastModified,
                        req.body.numTracks,
                        req.body.playtime
                    ],
                    (err, data) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                res.status(422).json(err.sqlMessage);
                                return;
                            }
                            else {
                                res.status(500).json(err);
                                return;
                            }
                        }
                        else {
                            res.json(data);
                            return;
                        }
                    });
            }
        });
});

// Get all users playlists
secureListRouter.get('', (req, res) => {
    db.query(`SELECT playlists.id, 
    playlists.name,
    playlists.user,
    users.username,
    playlists.description,
    playlists.public,
    playlists.numTracks,
    playlists.playtime,
    playlists.rating,
    playlists.lastModified,
    playlists.tracks
    FROM playlists
    LEFT JOIN users
    ON playlists.user=users.id
    WHERE user=?;`, [req.query.user], (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (data.length === 0) {
            res.status(404).json("No Lists Found");
        }
        else {
            res.json(data);
        }
    });
});


// Updates editable values for the playlist
secureListRouter.post('/:id', (req, res) => {
    db.query(`UPDATE playlists SET 
                description=?,
                public=?,
                numTracks=?,
                playtime=?,
                lastModified=?,
                tracks=? 
                WHERE id=?;`,
        [
            req.body.description,
            req.body.public,
            req.body.numTracks,
            req.body.playtime,
            req.body.lastModified,
            req.body.tracks,
            req.params.id
        ],
        (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(422).json(err.sqlMessage);
                    return;
                }
                else {
                    res.status(500).json(err);
                    return;
                }
            }
            else {
                res.json(data);
                return;
            }
        });
});

// Deletes the playlist given an ID
secureListRouter.delete('/:id', (req, res) => {
    db.query("DELETE FROM playlists WHERE id=?", [req.params.id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        else {
            res.json("Success");
            return;
        }
    });
});

secureListRouter.put('/review', (req, res) => {
    
    db.query("INSERT INTO reviews (playlistId, name, user, rating, review, hidden, date) VALUES (?, ?, ?, ?, ?, ?, ?);", [req.body.playlistId, req.body.name, req.body.user, req.body.rating, req.body.review, "false", req.body.date], (err) => {
        if(err != null){

            res.json(err);
        }
        else {
            res.json("Success");
        }
    })

});

secureListRouter.get("/review/:id", (req, res) => {

    db.query("SELECT reviews.reviewId, reviews.playlistId, reviews.name, reviews.user, users.username, reviews.rating, reviews.review, reviews.hidden FROM reviews LEFT JOIN users ON reviews.user=users.id WHERE playlistId=?", [req.params.id], (err, data) => {
        if (err != null) {
            res.json(err);
        }
        else {
            res.json(data);
        }
    })
});

secureListRouter.get("/count", (req, res) => {

    db.query("SELECT count(*) AS count FROM reviews WHERE user=? AND playlistId=?;", [req.query.userId, req.query.playlistId], (err, data) => {
        if (err != null) {
            res.status(500).json(err)
        }
        else {
            res.json(data);
        }
    })

}
)

module.exports = secureListRouter;