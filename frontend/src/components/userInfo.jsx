import React from "react";
import { useState } from "react";
import "../styles/userInfo.css";

function UserInfo(user) {

    //state for admin and activation
    const [adminState, setAdminState] = useState(user.admin === "true" ? "true" : "false");
    const [activationState, setActivationState] = useState(user.activated === "true" ? "true" : "false");

    //toggles admin
    const handleAdminChange = () => {

        let tempState = "";
        if (adminState === "true") {
            tempState = "false";
        }
        else {
            tempState = "true";
        }

        //posts toggled admin state
        fetch("/api/admin/update/admin", { method: "POST", body: JSON.stringify({ "admin": tempState, "id": user.id }), headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                setAdminState(tempState);
            })
            .catch(err => {
                console.log(err);
                alert("Error updating user!");
            })
    }

    //toggles activation change
    const handleActivationChange = () => {

        let tempState = "";
        if (activationState === "true") {
            tempState = "false";
        }
        else {
            tempState = "true";
        }

        //posts toggled activation state
        fetch("/api/admin/update/activation", { method: "POST", body: JSON.stringify({ "activation": tempState, "id": user.id }), headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                setActivationState(tempState);
            })
            .catch(err => {
                console.log(err);
                alert("Error updating user!");
            })
    }

    //returns user information
    return (
        <React.Fragment>
            <ul>
                <li className="userLI">Username: {user.username}</li>
                <li className="userLI">ID: {user.id}</li>
                <li className="userLI">
                    <label>Has Admin: </label>
                    <input type="checkbox" name="public" onChange={handleAdminChange} checked={adminState === "true" ? true : false} /><br />
                </li>
                <li className="userLI">
                    <label>Activated: </label>
                    <input type="checkbox" name="public" onChange={handleActivationChange} checked={activationState === "true" ? true : false} /><br />
                </li>
            </ul>
        </React.Fragment>
    )
}

export default UserInfo;