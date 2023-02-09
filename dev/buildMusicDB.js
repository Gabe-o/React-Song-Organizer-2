import mysql from 'mysql2';
import fs from 'fs';
import csv from 'csv-parser';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab4db',
    multipleStatements: true
});

// Builds Albums table from CSV file
function buildAlbumsDB() {
    // Deletes the table if one already exists
    db.query("DROP TABLE albums;", (err) => {
        if (err) {
            console.log("No Table to drop");
        }
        else {
            console.log("Dropped Table");
        }
    }
    );

    // Creates new table
    db.query(
        `CREATE TABLE albums (
        albumID int NOT NULL,
        albumName varchar(100) DEFAULT NULL,
        PRIMARY KEY (albumID)
        ) DEFAULT CHARSET=utf8mb4;`, (err) => {
        if (err) {
            throw err;
        }
        console.log("Album Table Created");
    }
    );

    // Adds albums from CSV to the db
    let albums = [];
    fs.createReadStream('data/raw_albums.csv')
        .pipe(csv())
        .on('data', (data) => albums.push(data))
        .on('end', () => {
            let i = 0;
            for (let album of albums) {
                db.query("INSERT INTO albums VALUES (?, ?);",
                    [
                        album.album_id,
                        album.album_handle.replace(/[_"]/g, ' ').trim()
                    ],
                    (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Inserted album " + album.album_id + " into albums table \t" + ((++i) / albums.length) * 100 + " \t%");
                    });
            }
        });
}

// Builds Artists table from CSV file
function buildArtistsDB() {
    // Deletes the table if one already exists
    db.query("DROP TABLE artists;", (err) => {
        if (err) {
            console.log("No Table to drop");
        }
        else {
            console.log("Dropped Table");
        }
    }
    );

    // Creates new table
    db.query(
        `CREATE TABLE artists (
        artistID int NOT NULL,
        artistName varchar(100) DEFAULT NULL,
        artistLocation varchar(100) DEFAULT NULL,
        artistFavorites int DEFAULT NULL,
        artistDateCreated varchar(45) DEFAULT NULL,
        artistWebsite varchar(200) DEFAULT NULL,
        artistAssociatedLabels text DEFAULT NULL,
        PRIMARY KEY (artistID)
        ) DEFAULT CHARSET=utf8mb4;`, (err) => {
        if (err) {
            throw err;
        }
        console.log("Artists Table Created");
    }
    );

    // Adds artists from the CSV file to the db
    let artists = [];
    fs.createReadStream('data/raw_artists.csv')
        .pipe(csv())
        .on('data', (data) => artists.push(data))
        .on('end', () => {
            let i = 0;
            for (let artist of artists) {
                db.query("INSERT INTO artists VALUES (?, ?, ?, ?, ?, ?, ?);",
                    [
                        artist.artist_id,
                        artist.artist_handle.replace(/[_"]/g, ' ').trim(),
                        artist.artist_location.replaceAll('"', "").split('\n')[0].slice(0, 99),
                        artist.artist_favorites,
                        artist.artist_date_created.replaceAll('"', ""),
                        artist.artist_website.replaceAll('"', ""),
                        artist.artist_associated_labels.replaceAll('"', "")
                    ],
                    (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Inserted artist " + artist.artist_id + " into artists table \t" + ((++i) / artists.length) * 100 + " \t%");
                    });
            }
        });
}

// Builds Tracks table from CSV file
function buildTracksDB() {
    // Deletes table if one already exists
    db.query("DROP TABLE tracks;", (err) => {
        if (err) {
            console.log("No Table to drop");
        }
        else {
            console.log("Dropped Table");
        }
    }
    );

    // Creates new table
    db.query(
        `CREATE TABLE tracks (
        trackID int NOT NULL,
        albumID int DEFAULT NULL,
        artistID int DEFAULT NULL,
        trackTags text DEFAULT NULL,
        trackDateCreated varchar(45) DEFAULT NULL,
        trackDateRecorded varchar(45) DEFAULT NULL,
        trackDuration varchar(45) DEFAULT NULL,
        trackGenres text DEFAULT NULL,
        trackNumber int DEFAULT NULL,
        trackTitle varchar(200) DEFAULT NULL,
        PRIMARY KEY (trackID)
        ) DEFAULT CHARSET=utf8mb4;`, (err) => {
        if (err) {
            throw err;
        }
        console.log("Tracks Table Created");
    }
    );

    // Adds Tracks from CSV file to the db
    let tracks = [];
    fs.createReadStream('data/raw_tracks.csv')
        .pipe(csv())
        .on('data', (data) => tracks.push(data))
        .on('end', () => {
            let i = 0;
            for (let track of tracks) {
                // Deconstructs genres object into just genre names
                let trackGenres = track.track_genres !== "" ? JSON.parse(track.track_genres.replaceAll("'", '"')) : [];

                let genreNames = "";
                for (let i = 0; i < trackGenres.length; i++) {
                    genreNames += trackGenres[i].genre_title + (i + 1 < trackGenres.length ? ", " : "");
                }

                db.query("INSERT INTO tracks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                    [
                        track.track_id,
                        track.album_id === '' ? null : track.album_id,
                        track.artist_id,
                        track.tags.replaceAll('"', ""),
                        track.track_date_created.replaceAll('"', ""),
                        track.track_date_recorded.replaceAll('"', ""),
                        track.track_duration.replaceAll('"', ""),
                        genreNames.replaceAll('"', ""),
                        track.track_number,
                        track.track_title.replace(/[;\\"]/g, "").trim()
                    ],
                    (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Inserted track " + track.track_id + " into tracks table \t" + ((++i) / tracks.length) * 100 + " \t%");
                    });
            }
        });
}

// =========================================================================================

buildAlbumsDB();
buildArtistsDB();
buildTracksDB();
