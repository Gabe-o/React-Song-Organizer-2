import React from "react";
import { useState } from 'react';
import "../styles/playlists.css";
import "../styles/homePage.css";
import "../styles/track.css";
import Playlist from "./playlist";

function Playlists() {

    //sets states for inputs and playlists
    const [inputs, setInputs] = useState({});
    const [playlists, setPlaylists] = useState([]);

    //detects user changes
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    //detects user submit
    const handleSubmit = (e) => {
        e.preventDefault();
        //gets playlist search results from user input
        fetch("/api/open/playlists?name=" + (inputs.playlist !== undefined ? inputs.playlist : ""), { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
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

    //returns form with user input and display lists
    return (
        <React.Fragment>
            <div className="defaultMargin">
                <form onSubmit={handleSubmit}>
                    <input className="inputSearch" type="text" name="playlist" onChange={handleChange} value={inputs.playlist || ""} placeholder="Search Playlist" /><br />
                </form>
                {
                    playlists !== "No Lists Found" ? playlists.map((playlist) => <Playlist {...playlist} key={playlist.id} />) : <div></div>
                }
            </div>
        </React.Fragment>
    )
}

export default Playlists;