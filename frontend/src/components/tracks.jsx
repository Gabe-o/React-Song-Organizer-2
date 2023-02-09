import { useState } from 'react';
import "../styles/homePage.css";
import "../styles/track.css";
import Track from './track';

function Tracks() {
    // Hold values of the search form
    const [inputs, setInputs] = useState({
        track: "",
        artist: "",
        album: "",
        genre: "",
        similarity: false,
        results: 10,
    });

    // holds the list of track objects
    const [tracks, setTracks] = useState([]);

    // Max number of results user can request from the server at a time
    const maxResults = 50;

    // Handles changes to the search form
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    // Handles changes for the check boxes
    const handleCheckboxChange = (event) => {
        const name = event.target.name;
        const value = event.target.checked;
        setInputs(values => ({ ...values, [name]: value }));
    }

    // Handles from submission to search db for tracks
    const handleSubmit = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            fetch("/api/open/tracks?" +
                "track=" + inputs.track.trim() +
                "&artist=" + inputs.artist.trim() +
                "&album=" + inputs.album.trim() +
                "&genre=" + inputs.genre.trim() +
                "&similarity=" + inputs.similarity +
                "&results=" + inputs.results,
                {
                    method: "GET",
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                .then(httpResp => {
                    return httpResp.json().then(data => {
                        if (httpResp.ok) {
                            setTracks(data);
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
    }

    //returns search bar for tracks and displays results
    return (
        <div className='defaultMargin'>
            <form onKeyDown={handleSubmit}>
                <input className='inputSearch' type="text" name="track" onChange={handleChange} value={inputs.track || ""} placeholder="Search by Track" />
                <input className='inputSearch' type="text" name="artist" onChange={handleChange} value={inputs.artist || ""} placeholder="Search by Artist" /><br />
                <input className='inputSearch' type="text" name="album" onChange={handleChange} value={inputs.album || ""} placeholder="Search by Album" />
                <input className='inputSearch' type="text" name="genre" onChange={handleChange} value={inputs.genre || ""} placeholder="Search by Genre" /><br />
                <label className='inputLabel'>Similarity Search </label>
                <input type="checkbox" name="similarity" onChange={handleCheckboxChange} value={inputs.similarity} /><br />
                <label className='inputLabel'>Results </label>
                <input className='inputNum' type="number" name="results" onChange={handleChange} value={inputs.results <= maxResults ? inputs.results || "" : maxResults} />
            </form>
            {
                tracks.map((track) => <Track {...track} key={track.trackID} />)
            }
        </div>
    );
}

export default Tracks;