import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/changePassword.css";

function ChangePassword() {

    //state to save password input
    const [inputs, setInputs] = useState({});

    //gets input and sets it
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    //changes passwird
    const changePassword = (e) => {

        e.preventDefault();
        const user = auth.currentUser;
        const newPassword = inputs.password;

        //updates password in firebase
        updatePassword(user, newPassword).then(() => {
            alert("Password change succsesful!");
        })
            .catch((error) => {
                alert("Password change failed!");
            })

    }

    //returns for to change password
    return (
        <div className='cPadding'>
            <form onSubmit={changePassword}>
                <label className="cLabel">Change Password</label>
                <input className="cInput" placeholder="New Password" type="text" name="password" onChange={handleChange} value={inputs.password || ""} />
                <button className="cButton" type="submit">Change Password</button>
            </form>
        </div>
    )
}

export default ChangePassword;