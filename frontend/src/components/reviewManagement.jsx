import { useState } from "react";
import React from "react";
import ReviewInfo from "./playlistInfo";
import "../styles/track.css";
import "../styles/homePage.css";

function ReviewManagement() {

    //state for inputs and playlists
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
        //gets all reviews for playlist
        fetch("/api/open/playlists?name=" + (inputs.playlist !== undefined ? inputs.playlist : ""), { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPlaylists(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    //return list of playlists and reviews
    return (
        <React.Fragment>
            <div className="defaultMargin">
                <form onSubmit={handleSubmit}>
                    <input className="inputSearch" type="text" name="playlist" onChange={handleChange} value={inputs.playlist || ""} placeholder="Search Playlist" /><br />
                </form>
                {
                    playlists !== "No Lists Found" ? playlists.map((playlist) => <ReviewInfo {...playlist} key={playlist.id} />) : <div>{alert("No results found!")}</div>
                }
            </div>

        </React.Fragment>
    )
}

export default ReviewManagement;
