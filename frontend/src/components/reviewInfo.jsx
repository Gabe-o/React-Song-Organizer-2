import React, { useEffect } from "react";
import { useState} from "react";
import { Rating } from "react-simple-star-rating";
import "../styles/userInfo.css";

function ReviewInfo(review){

    //sets states
    const [inputs, setInputs] = useState({});
    const [hidden, setHidden] = useState(review.hidden === "true" ? "true" : "false");
    const [dmca, setDMCA] = useState({});
    const [takedown, setTakedown] = useState(false);
    const [infringement, setInfringement] = useState(false);
    const [dispute, setDispute] = useState(false);
    const [save, setSave] = useState(false);

    useEffect(() => {
        fetch("/api/admin/dcma/" + review.reviewId, {method: "GET", headers: new Headers({ 'Content-Type': 'application/json' })})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setDMCA(data[0]);
        })
        .catch(err => {
            console.log(err);
        })
    }, [save]);

    //detects user changes
    const handleChange = () => {

        let tempState = "";
        if (hidden === "true") {
            tempState = "false";
        }
        else {
            tempState = "true";
        }

        //posts toggle for hidden review
        fetch("/api/admin/update/review", { method: "POST", body: JSON.stringify({ "hidden": tempState, "reviewId": review.reviewId }), headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                setHidden(tempState);
            })
            .catch(err => {
                console.log(err);
                alert("Error updating user!");
            })
    }

    //gets user input
    const handleInputs = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    //button to report dcma infractions
    const takedownButton = () => {
        setTakedown(!takedown);
    }

    const infringementButton = () => {
        setInfringement(!infringement);
    }

    const disputeButton = () => {
        setDispute(!dispute);
    }

    //posts takedown report
    const saveTakedown = () => {
        
        setSave(true);
        
        fetch("/api/admin/update/takedown/" + review.reviewId, {method: "POST", body: JSON.stringify({"takedown" : inputs.takedown}), headers: new Headers({ 'Content-Type': 'application/json' })})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setSave(false);
        })
        .catch(err => {
            console.log(err);
            setSave(false);
        });
    }

    //posts infringement report
    const saveInfringement = () => {
        setSave(true);
        
        fetch("/api/admin/update/infringement/" + review.reviewId, {method: "POST", body: JSON.stringify({"infringement" : inputs.infringement}), headers: new Headers({ 'Content-Type': 'application/json' })})
        .then(res => res.json())
        .then(data => {
            setSave(false);
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    //posts dispute report
    const saveDispute = () => {

        setSave(true);

        fetch("/api/admin/update/dispute/" + review.reviewId, {method: "POST", body: JSON.stringify({"dispute" : inputs.dispute}), headers: new Headers({ 'Content-Type': 'application/json' })})
        .then(res => res.json())
        .then(data => {
            setSave(false);
            console.log(data);
        })
        .catch(err => {
            setSave(false);
            console.log(err);
        });
    }

    //returns form to input dcma infraction reports
    return (
        <React.Fragment>
            <br></br>
            <ul>
                <li className="userLI">Review By: {review.username}</li>
                <li className="userLI">Description: {review.review}</li>
                <li className="userLI">Rating: {<Rating
                initialValue={review.rating}
                size={20}
                readonly={review.rating > 0}
                fillColor='orange'
                emptyColor='gray'
                className='foo' // Will remove the inline style if applied
            />}</li>
            <li className="userLI">Takedown Request: {dmca.takedown != undefined ? dmca.takedown : null}
            <input type="button" name="submitTakedown" onClick={takedownButton} value={!takedown ? "Enter Date" : "Cancel"} />
                {takedown ? <div><input type="text" name="takedown" onChange={handleInputs} value={inputs.takedown || ""}/><button onClick={saveTakedown}>Save</button></div> : null}
            </li>
            <li className="userLI">Infringement Notice: {dmca.infringement != undefined ? dmca.infringement : null}
                <input type="button" name="submitInfringement" onClick={infringementButton} value={!infringement ? "Enter Date" : "Cancel"} />
                {infringement ? <div><input type="text" name="infringement" onChange={handleInputs} value={inputs.infringement || ""}/><button onClick={saveInfringement}>Save</button></div> : null}
            </li>
            <li className="userLI">Dispute Claim: {dmca.dispute != undefined ? dmca.dispute : null}
                <input type="button" name="submitTakedown" onClick={disputeButton} value={!dispute ? "Enter Date" : "Cancel"} />
                {dispute ? <div><input type="text" name="dispute" onChange={handleInputs} value={inputs.dispute || ""}/><button onClick={saveDispute}>Save</button></div> : null}
            </li>
            <li className="userLI">
                <label>Hidden: </label>
                <input type="checkbox" name="public" onChange={handleChange} checked={hidden === "true" ? true : false} /><br />
            </li>
            </ul>
            <br></br>
        </React.Fragment>
    )
}

export default ReviewInfo;