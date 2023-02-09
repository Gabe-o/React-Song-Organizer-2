import { useState, useEffect } from 'react';
import moment from 'moment';
import Track from './track';

import '../styles/editPlaylist.css';

function EditPlaylist({ description, id, lastModified, username, name, numTracks, playtime, isPublic, rating, tracks, user, allPlaylists, setAllPlaylists }) {

    // Holds the pending changes the user has made to the playlist
    let [details, setDetails] = useState({});
    // Holds the last saved state of the playlist in the db
    let [savedDetails, setSavedDetails] = useState({});
    // Hold the list of tracks objects in the playlist
    let [tracksList, setTracksList] = useState([]);
    // For delete playlist confirmation
    let [deleteFunction, setdeleteFunction] = useState(<input id="delButton" type="button" value="DELETE" onClick={deletePlaylist} />)

    // Sets the details based on props at initialization
    useEffect(() => {
        let playlist = {
            description: description,
            id: id,
            lastModified: lastModified,
            username: username,
            name: name,
            numTracks: numTracks,
            playtime: playtime,
            public: isPublic,
            rating: rating,
            tracks: tracks,
            user: user
        }
        setDetails(playlist);
        setSavedDetails(playlist);
    }, [description, id, lastModified, username, name, numTracks, playtime, isPublic, rating, tracks, user]);

    // Fetchs the track objects whenever the playlist saves
    useEffect(() => {
        fetchTracks();
    }, [savedDetails]);

    // fetchs the tracks for the selected playlist from backend
    const fetchTracks = async () => {
        // Parses the tracks list to an integer list
        let newTracks = [];
        let totalDuration = 0;
        let trackIds = details.tracks ? details.tracks.split(",").map(n => parseInt(n)).filter(n => n) : [];

        // Fetches each track if it exist and calculations total duration for the playlist
        for (let id of trackIds) {
            await fetch("/api/open/tracks/" + id,
                {
                    method: "GET",
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                .then(httpResp => {
                    return httpResp.json().then(data => {
                        if (httpResp.ok) {
                            newTracks.push(data[0]);
                            // Calculation for total duration of list
                            let trackDur = data[0].trackDuration.split(":");
                            totalDuration += parseInt(trackDur[0]) * 60 + parseInt(trackDur[1]);
                        }
                        else {
                            throw new Error(httpResp.status + "\n" + JSON.stringify(data));
                        }
                    })
                })
                .catch(err => {
                    alert(err);
                });
        }

        // Formating total duration to string for display
        totalDuration = `${parseInt(totalDuration / 60)}:${totalDuration % 60}`;
        setDetails(values => ({ ...values, numTracks: trackIds.length, playtime: totalDuration }));
        // Updating tracks list
        setTracksList(newTracks);
    }

    // Updates state based on value changes to form fields
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDetails(values => ({ ...values, [name]: value }));
    }

    // Updates state for checkboxes in SQL friendly format
    const handleCheckboxChange = (event) => {
        const name = event.target.name;
        const value = event.target.checked ? 1 : 0;
        setDetails(values => ({ ...values, [name]: value }));
    }

    // On submission updates selected playlist's details in the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (JSON.stringify(details) !== JSON.stringify(savedDetails)) {
                // Fetching and checking if the tracks entered exist
                let newTracks = [];
                let totalDuration = 0;
                let trackIds = details.tracks ? details.tracks.split(",").map(n => parseInt(n)).filter(n => n) : [];

                // If no track id is entered throw error
                if (trackIds.length === 0) {
                    throw new Error("Cannot save a playlist with no tracks");
                }
                // Checks that all track ids entered are vaild
                for (let id of trackIds) {
                    await fetch("/api/open/tracks/" + id,
                        {
                            method: "GET",
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            })
                        })
                        .then(httpResp => {
                            return httpResp.json().then(data => {
                                if (httpResp.ok) {
                                    newTracks.push(data[0]);
                                    // Calculation for total duration of list
                                    let trackDur = data[0].trackDuration.split(":");
                                    totalDuration += parseInt(trackDur[0]) * 60 + parseInt(trackDur[1]);
                                }
                                else {
                                    throw new Error(httpResp.status + "\n" + JSON.stringify(data));
                                }
                            })
                        })
                        .catch(err => {
                            throw err;
                        });
                }

                // saves new playlistinformation everywhere
                let time = moment().format('YYYY-MM-DD HH:mm:ss');
                totalDuration = `${parseInt(totalDuration / 60)}:${totalDuration % 60}`;
                setDetails(values => ({ ...values, numTracks: trackIds.length, playtime: totalDuration, lastModified: time, tracks: trackIds.toString() }));
                setSavedDetails({ ...details, numTracks: trackIds.length, playtime: totalDuration, lastModified: time, tracks: trackIds.toString() });
                savePlaylist({ ...details, numTracks: trackIds.length, playtime: totalDuration, lastModified: time, tracks: trackIds.toString() });
            }
        }
        catch (err) {
            alert(err);
        }
    }

    // Saves the playlist ot the db
    const savePlaylist = (playlist) => {
        fetch("/api/secure/playlists/" + playlist.id,
            {
                method: "POST",
                body: JSON.stringify({
                    "description": playlist.description,
                    "public": playlist.public,
                    "numTracks": playlist.numTracks,
                    "playtime": playlist.playtime,
                    "lastModified": playlist.lastModified,
                    "tracks": playlist.tracks,
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(httpResp => {
                return httpResp.json().then(data => {
                    if (httpResp.ok) {
                        // Updates the playlist button in the managePlaylist component
                        let newPlaylists = allPlaylists;
                        let index = newPlaylists.findIndex(playlist => playlist.id === savedDetails.id);
                        newPlaylists[index] = playlist;
                        setAllPlaylists(newPlaylists);
                    }
                    else {
                        throw new Error(httpResp.status + "\n" + JSON.stringify(data));
                    }
                })
            })
            .catch(err => {
                alert(err);
            });
    }

    // Removes the track that was clicked on visually from the page
    const removeTrack = (event) => {
        // Splits tracks text area by commas parses everything to and integer and filters for valid integers
        let newTrackIds = details.tracks.split(",").map(n => parseInt(n)).filter(n => n);
        // Removes tracks at the tracks remove buttons index
        newTrackIds.splice(event.target.name, 1);
        // Updates the text area
        setDetails(values => ({ ...values, tracks: newTrackIds.toString() }));
        // Same thing as above but for the track object
        let newTracks = tracksList;
        newTracks.splice(event.target.name, 1)
        setTracksList(newTracks);
    }

    // Deletes a playlist
    function deletePlaylist(event) {
        // First click of the delete button replaces it with 2 buttons for cancel or confirmation
        if (event.target.value === "DELETE") {
            setdeleteFunction(
                <div>
                    <input id="delButton" type="button" value="CONFIRM" onClick={deletePlaylist} />
                    <input id="cancelButton" type="button" value="CANCEL" onClick={deletePlaylist} />
                </div>
            );
        }
        // If confirm is clicked proceed with deletion
        else if (event.target.value === "CONFIRM") {
            // Deletes playlist
            fetch("/api/secure/playlists/" + id,
                {
                    method: "DELETE",
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                .then(httpResp => {
                    return httpResp.json().then(data => {
                        if (httpResp.ok) {
                            const filteredPlaylists = allPlaylists.filter((playlist) => playlist.id !== id);
                            setAllPlaylists(filteredPlaylists);
                            setdeleteFunction(<input id="delButton" type="button" value="DELETE" onClick={deletePlaylist} />);
                        }
                        else {
                            throw new Error(httpResp.status + "\n" + JSON.stringify(data));
                        }
                    })
                })
                .catch(err => {
                    alert(err);
                });
        }
        // Otherwise cancel was clicked and set button back to initial state
        else {
            setdeleteFunction(<input id="delButton" type="button" value="DELETE" onClick={deletePlaylist} />);
        }
    }

    //returns playlist information
    return (
        <div className='editPlaylist'>
            <h1>{details.name}</h1>
            <p>Created By: {details.username}</p>
            <p>Number of Tracks: {details.numTracks}</p>
            <p>Total Playtime: {details.playtime}</p>
            <p>Last Modified: {details.lastModified}</p>
            <form onSubmit={handleSubmit}>
                <textarea className='description' name="description" onChange={handleChange} value={details.description || ""} placeholder="Description"></textarea><br />
                <label>Make Public  </label>
                <input type="checkbox" name="public" onChange={handleCheckboxChange} value={details.public === 1 ? true : false} checked={details.public === 1 ? true : false} /><br />
                <button id="saveButton" type="submit">SAVE</button>
                {
                    deleteFunction
                }
                <br />
                {
                    tracksList.map((track, i) => {
                        return (
                            <div className="trackListItem" key={i}>
                                <div className="trackRemoveButton">
                                    <input type="button" name={i} onClick={removeTrack} value="-" />
                                </div>
                                <div className="trackDetails">
                                    <Track {...track} />
                                </div>
                            </div>
                        );
                    })
                }
                <label>Tracks  </label><br />
                <textarea id="tracksInput" type="text" name="tracks" onChange={handleChange} value={details.tracks || ""} />
            </form >
        </div >

    );
}

export default EditPlaylist;
