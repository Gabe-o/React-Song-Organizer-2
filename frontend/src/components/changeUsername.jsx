import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/changePassword.css";

//same functionality as changePassword
function ChangeUsername() {

    //state for user input
    const [inputs, setInputs] = useState({});

    //gets user input
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const changeUsername = (e) => {

        e.preventDefault();
        const user = auth.currentUser;
        const newUsername = inputs.username;

        //gets all current users
        fetch("/api/open/usernames", { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                //if user inputted name is taken, then send
                if (data.some(user => user.username === newUsername)) {
                    alert("That username is taken!");
                }
                else { //put request to change username in mySQL database
                    fetch("/api/secure/usernames/update/" + user.uid, { method: "PUT", body: JSON.stringify({ "username": newUsername }), headers: new Headers({ 'Content-Type': 'application/json' }) })
                        .then(res => res.json())
                        .then(data => {
                            alert("Your username has been changed!");
                            Navigate(useLocation);

                        })
                        .catch(err => {

                            alert("Error changing username. Please try again later")
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                alert("An error occured");
                console.log(err);
            })
    }

    //returns form to change username
    return (
        <div className="cPadding">
            <form onSubmit={changeUsername}>
                <label className="cLabel">Change Username</label>
                <input className="cInput" type="text" name="username" placeholder="Change Username" onChange={handleChange} value={inputs.username || ""} />
                <button className="cButton" type="submit">Change Username</button>
            </form>
        </div>
    )
}

export default ChangeUsername;