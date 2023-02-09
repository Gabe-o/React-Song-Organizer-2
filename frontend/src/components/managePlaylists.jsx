import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Tracks from './tracks';
import EditPlaylist from './editPlaylist';
import '../styles/managePlaylist.css';
import { auth } from '../firebase.js';
import { useRef } from 'react';

function ManagePlaylist() {
    // Stores data for the new playlist form
    const [newPlaylist, setNewPlaylist] = useState({
        name: "",
        user: "",
        tracks: "",
        lastModified: ""
    });

    // Stores a list of the users playlists
    const [playlists, setPlaylists] = useState([]);

    // Stores the selected playlist
    const [selectedPlaylist, setSelectedPlaylist] = useState({});

    // Stores the playlist selection buttons
    const [playlistButtons, setPlaylistButtons] = useState(<div></div>)

    // Stores the new playlist that is about to sent to the server for creation this is nessecary for saving the time the user last made changes
    const playlistToSend = useRef({
        name: "",
        user: "",
        tracks: "",
        lastModified: ""
    });

    // Gets user info and retrives playlist from the db
    useEffect(() => {
        let user = auth.currentUser.uid;
        setNewPlaylist(values => ({ ...values, user: user }));
        getPlaylists(user);
    }, []);

    // When the list of playlists updates the selected playlist is cleared and the buttons are rebuilt
    useEffect(() => {
        setSelectedPlaylist({});
        setPlaylistButtons(playlists.map((playlist, i) => <div key={i}><button onClick={selectPlaylist} name={i}>{playlist.name}</button><br /></div>));
    }, [playlists]);

    // Whenever a change is made the the new playlist for the time of that change is logged in the playlist to send
    useEffect(() => {
        playlistToSend.current = newPlaylist;
        playlistToSend.current.lastModified = moment().format('YYYY-MM-DD HH:mm:ss');
    }, [newPlaylist]);

    // handles changes for the new playist creation form
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewPlaylist(values => ({ ...values, [name]: value }));
    }

    // handles submission of a new playlist
    const handleSubmit = async (event) => {
        event.preventDefault();

        // If no name or tracks are entered send alert
        if (playlistToSend.current.name === "" || playlistToSend.current.tracks === "") {
            alert("Playlist name and tracks are required fields");
        }
        else {
            try {
                // Parsing whatever the user type to an integer list
                let newTracks = [];
                let totalDuration = 0;
                let trackIds = newPlaylist.tracks ? newPlaylist.tracks.split(",").map(n => parseInt(n)).filter(n => n) : [];

                // Checking the db for tracks that match integers in the list and calculating the total duration
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


                // Creating the new playlist
                fetch("/api/secure/playlists",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "name": playlistToSend.current.name,
                            "user": playlistToSend.current.user,
                            "tracks": playlistToSend.current.tracks,
                            "lastModified": playlistToSend.current.lastModified,
                            "numTracks": trackIds.length,
                            "playtime": `${parseInt(totalDuration / 60)}:${totalDuration % 60}`
                        }),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                    .then(httpResp => {
                        return httpResp.json().then(data => {
                            if (httpResp.ok) {
                                // Clearing new playlist inputs and getting this users playlists from backend
                                setNewPlaylist(values => ({ ...values, name: "", tracks: "", lastModified: "" }));
                                getPlaylists(newPlaylist.user);
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
            catch (err) {
                alert(err);
            }
        }
    }

    // Gets this users playlist from the db
    const getPlaylists = (user) => {
        fetch("/api/secure/playlists?user=" + user,
            {
                method: "GET",
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(httpResp => {
                return httpResp.json().then(data => {
                    if (httpResp.ok) {
                        setPlaylists(data);
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

    // Sets the selected playlist based on the button the user clicked
    const selectPlaylist = (event) => {
        setSelectedPlaylist(playlists[event.target.name]);
    }

    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className='playlistSide'>
                <div className="selectBox">
                    <form onSubmit={handleSubmit}>
                        <input className="playlistSearch" type="text" name="name" onChange={handleChange} value={newPlaylist.name || ""} placeholder="Playlist Name" />
                        <input className="playlistSearch" type="text" name="tracks" onChange={handleChange} value={newPlaylist.tracks || ""} placeholder="Tracks" />
                        <button className='addButton' type="submit"><i class="fa fa-plus"></i></button>
                    </form>
                    <div>
                        {
                            playlistButtons
                        }
                    </div>
                </div>
                <div className="playlistBox">
                    {
                        JSON.stringify(selectedPlaylist) === "{}" ? <h1 className='cH1'>Select a playlist</h1> : <EditPlaylist
                            description={selectedPlaylist.description}
                            id={selectedPlaylist.id}
                            lastModified={selectedPlaylist.lastModified}
                            username={selectedPlaylist.username}
                            name={selectedPlaylist.name}
                            numTracks={selectedPlaylist.numTracks}
                            playtime={selectedPlaylist.playtime}
                            isPublic={selectedPlaylist.public}
                            rating={selectedPlaylist.rating}
                            tracks={selectedPlaylist.tracks}
                            user={selectedPlaylist.user}
                            allPlaylists={playlists}
                            setAllPlaylists={setPlaylists} />
                    }
                </div>
            </div>
            <div className="tracksBox">
                <Tracks />
            </div>
        </div>
    );
}

export default ManagePlaylist;