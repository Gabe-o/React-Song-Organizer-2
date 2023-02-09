import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from 'react-simple-star-rating';
import { auth } from "../firebase";
import moment from "moment";

function ReviewForm(playlist) {

    //state for ratings, inputs, and buttonState
    const [rating, setRating] = useState(0) // initial rating value
    const [inputs, setInputs] = useState({});
    const [buttonState, setButtonState] = useState(false);
    const navigate = useNavigate();

    //detects user change
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    //detects new rating
    const handleRating = (rate) => {
        setRating(rate)
    }

    //submits review
    const submitReview = () => {
        if (auth.currentUser != null) {
            if (buttonState) {
                //checks to see if user already posted review
                fetch("/api/secure/playlists/count?userId=" + auth.currentUser.uid + "&playlistId=" + playlist.id, { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
                    .then(res => res.json())
                    .then(data => {
                        if (data[0].count > 0) {
                            alert("You have already submitted a review for this playlist!")
                        }
                        else { //if no review posted, then add review
                            fetch("/api/secure/playlists/review", { method: "PUT", body: JSON.stringify({ "playlistId": playlist.id, "name": playlist.name, "user": auth.currentUser.uid, "rating": rating, "review": inputs.description, "date": moment().format('YYYY-MM-DD HH:mm:ss') }), headers: new Headers({ 'Content-Type': 'application/json' }) })
                                .then(res => res.json())
                                .then(data => {

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            setButtonState(!buttonState);
        }
        else {
            navigate("/login");
        }
    }

    //returns review
    return (
        <React.Fragment>
            <form>
                <label>Description: </label>
                <input type="text" name="description" onChange={handleChange} value={inputs.description} /><br />
                <Rating
                    onClick={handleRating}
                    ratingValue={rating}
                    size={20}
                    label
                    transition
                    fillColor='orange'
                    emptyColor='gray'
                    className='foo' // Will remove the inline style if applied
                />
                <input type="button" name="submitReview" onClick={submitReview} value={!buttonState ? "Post Review" : "Confirm"} /><br />
            </form>

        </React.Fragment>
    )
}


export default ReviewForm;