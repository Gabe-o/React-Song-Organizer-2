import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import "../styles/signUp.css";
function SignUp() {

    let navigate = useNavigate();

    //state for inputs and errors
    const [inputs, setInputs] = useState({});
    const [emailEmptyError, setEmailError] = useState(false);
    const [passwordEmptyError, setPasswordError] = useState(false);
    const [usernameEmptyError, setUsernameError] = useState(false);
    const [usernameTakenError, setUsernameTakenError] = useState(false);
    const [accountVerified, setAccountVerified] = useState(false);

    //detects user change
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const signUp = (e) => {

        e.preventDefault();

        //sets errors to false
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
        setUsernameTakenError(false);
        setAccountVerified(false);

        //user inputs
        const username = inputs.uname;
        const email = inputs.email;
        const password = inputs.password;

        //gets all usernames
        fetch("/api/open/usernames", {
            method: "GET", headers: new Headers({ 'Content-Type': 'application/json' })
        })
            .then((res => res.json()))
            .then(data => {

                //if username found, return username taken
                if (data.some(user => user.username === username)) {
                    alert("Username taken!");
                    setUsernameTakenError(true);
                }

                //if username not valid, set errors to true
                else if ((username === undefined || username === "") || (email === undefined || email === "") || (password === undefined || password === "") || usernameTakenError) {

                    if (username === undefined || username === "") {
                        setUsernameError(true);
                    }
                    if (email === undefined || email === "") {
                        setEmailError(true);
                    }
                    if (password === undefined || password === "") {
                        setPasswordError(true);
                    }
                }
                else { //else, create username
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            if (user != null) {
                                //posts account info to database
                                fetch("/api/open/usernames/insert", { method: "POST", body: JSON.stringify({ "username": username, "id": user.uid, "administrator": "false", "activated": "true" }), headers: new Headers({ 'Content-Type': 'application/json' }) })
                                    .then(res => res.json)
                                    .then(data => {
                                        console.log("Inserted user into database!");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                sendEmailVerification(user);
                                setAccountVerified(true);
                            }
                        })
                        //if firebase error
                        .catch((error) => {

                            const parsedError = error.toString().substring(error.toString().indexOf(":") + 1, error.toString().lastIndexOf("."));

                            if (parsedError === " Firebase: Password should be at least 6 characters (auth/weak-password)") {
                                alert("Password must be at least 6 characters!");
                            }
                            else if (parsedError === " Firebase: Error (auth/invalid-email)") {
                                alert("Invalid email address!");
                            }
                            else if (parsedError === " Firebase: Error (auth/email-already-in-use)") {
                                alert("This email is already registered!");
                            }
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    const loginPage = (e) => {
        navigate(-1);
    }

    //returns sign up page
    return (
        <div>
            <div className='container3'>
                <h1>Already have an account?</h1><br></br>
                <button className='submitB' onClick={loginPage}>Back to Login</button>
            </div>
            <div className='container4'>
                <h1 className='h1take2'>Create an Account</h1>
                <form onSubmit={signUp}>
                    <input type="text" className='usernameInput' name="uname" onChange={handleChange} value={inputs.uname || ""} placeholder="Enter Username"></input><br></br><br></br>
                    <input type="text" className='emailInput' name="email" onChange={handleChange} value={inputs.email || ""} placeholder="Enter Email"></input>
                    <input type="text" className='passwordInput' name="password" onChange={handleChange} value={inputs.password || ""} placeholder="Enter Password"></input><br></br><br></br>
                    <button className='submitB' type="submit">Submit</button>
                </form>
            </div>

            <p>{emailEmptyError ? "Email empty " : " "} {passwordEmptyError ? "Password empty " : " "} {usernameEmptyError ? "Username empty " : " "}</p>
            <p>{accountVerified ? "We have sent a verification email to " + inputs.email : ""}</p>
        </div>
    );
}

export default SignUp;