const express = require('express');

const db = require('../DBConnect.js');

const openTrackRouter = express.Router();

// Querys db for given trackTitle and/or albumName and returns specified number of results
openTrackRouter.get('', (req, res) => {
    // Response Handler
    const handleRes = (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (data.length === 0) {
            res.status(404).json("No Tracks Found");
        }
        else {
            console.log(JSON.stringify(data));
            res.json(data);
        }
    }

    // Similarity search enabled
    // Source: https://github.com/zufuliu/algorithm/blob/main/SimilarText/similar_text.sql - 
    // I copied this similar_text_ratio function to calculate the dice coefficient between 2 words
    if (req.query.similarity === "true") {
        db.query(`SELECT tracks.trackID,tracks.albumID,
            albums.albumName,tracks.artistID,
            artists.artistName,tracks.trackTags,
            tracks.trackDateCreated,tracks.trackDateRecorded,
            tracks.trackDuration,tracks.trackGenres,
            tracks.trackNumber,tracks.trackTitle
            FROM tracks
            LEFT JOIN albums ON tracks.albumID=albums.albumID
            LEFT JOIN artists ON tracks.artistID=artists.artistID
            WHERE (similar_text_ratio(trackTitle, ?) > 70 OR trackTitle LIKE ?)
            AND (similar_text_ratio(albumName, ?) > 70 OR albumName LIKE ?)
            AND (similar_text_ratio(artistName, ?) > 70 OR artistName LIKE ?)
            AND (similar_text_ratio(trackGenres, ?) > 70 OR trackGenres LIKE ?)
            LIMIT ?;`,
            [
                req.query.track,
                "%" + req.query.track + "%",
                req.query.album,
                "%" + req.query.album + "%",
                req.query.artist,
                "%" + req.query.artist + "%",
                req.query.genre,
                "%" + req.query.genre + "%",
                parseInt(req.query.results)
            ], handleRes);
    }
    // Similarity search disabled
    else {
        db.query(`SELECT tracks.trackID,tracks.albumID,
            albums.albumName,tracks.artistID,
            artists.artistName,tracks.trackTags,
            tracks.trackDateCreated,tracks.trackDateRecorded,
            tracks.trackDuration,tracks.trackGenres,
            tracks.trackNumber,tracks.trackTitle
            FROM tracks
            LEFT JOIN albums ON tracks.albumID=albums.albumID
            LEFT JOIN artists ON tracks.artistID=artists.artistID
            WHERE trackTitle LIKE ?
            AND albumName LIKE ?
            AND artistName LIKE ?
            AND trackGenres LIKE ?
            LIMIT ?;`,
            [
                "%" + req.query.track + "%",
                "%" + req.query.album + "%",
                "%" + req.query.artist + "%",
                "%" + req.query.genre + "%",
                parseInt(req.query.results)
            ], handleRes);
    }
});

// Querys db for given track id and returns 1 result
openTrackRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT tracks.trackID,tracks.albumID,' +
        'albums.albumName,tracks.artistID,' +
        'artists.artistName,tracks.trackTags,' +
        'tracks.trackDateCreated,tracks.trackDateRecorded,' +
        'tracks.trackDuration,tracks.trackGenres,' +
        'tracks.trackNumber,tracks.trackTitle ' +
        'FROM tracks ' +
        'LEFT JOIN albums ON tracks.albumID=albums.albumID ' +
        'LEFT JOIN artists ON tracks.artistID=artists.artistID ' +
        'WHERE tracks.trackID=?' +
        " LIMIT 1;", [id], (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            else if (data.length === 0) {
                res.status(404).json("Track Not Found");
                return;
            }
            else {
                res.json(data);
                return;
            }
        });
});

module.exports = openTrackRouter;