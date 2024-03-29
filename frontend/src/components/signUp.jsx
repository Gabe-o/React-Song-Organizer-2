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
    const [passwordNotConfirmedError, setPasswordNotConfirmedError] = useState(false);
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
        setPasswordNotConfirmedError(false);

        //user inputs
        const username = inputs.uname;
        const email = inputs.email;
        const password = inputs.password;
        const confirmPassword = inputs.confirmPassword;

        //gets all usernames
        fetch(window.location.protocol+"//"+window.location.hostname+":9000/api/open/usernames", {
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
                    if (password !== confirmPassword) {
                        setPasswordNotConfirmedError(true);
                    }
                }
                else { //else, create username
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            if (user != null) {
                                //posts account info to database
                                fetch(window.location.protocol+"//"+window.location.hostname+":9000/api/open/usernames/insert", { method: "POST", body: JSON.stringify({ "username": username, "id": user.uid, "administrator": "false", "activated": "true" }), headers: new Headers({ 'Content-Type': 'application/json' }) })
                                    .then(res => res.json)
                                    .then(data => {
                                        console.log("Inserted user into database!");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                sendEmailVerification(user);
                                setAccountVerified(true);
                                alert("Please visit your email to verify your account")
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
            <div className='flex-container'>
                <div className='container4'>
                <h1 className='h1take2'>Create an Account</h1>
                <form onSubmit={signUp}>
                    <input type="text" className='usernameInput' name="uname" onChange={handleChange} value={inputs.uname || ""} placeholder="Enter Username"></input>
                    <input type="text" className='emailInput' name="email" onChange={handleChange} value={inputs.email || ""} placeholder="Enter Email"></input>
                    <input type="password" className='passwordInput' name="password" onChange={handleChange} value={inputs.password || ""} placeholder="Enter Password"></input>
                    <input type="password" className='passwordInput' name="confirmPassword" onChange={handleChange} value={inputs.confirmPassword || ""} placeholder="Confirm Password"></input>
                    <button className='submitB' type="submit">Submit</button>
                </form>
                </div>

                <div style={{color: "red", fontWeight: "bold", margin: "5px 20px", fontSize: "20px"}}>{emailEmptyError ? <p>{"Email empty"}</p> : ""} {passwordEmptyError ? <p>{"Password empty"}</p> : ""} {passwordNotConfirmedError ? <p>{"Passwords don't match"}</p> : ""} {usernameEmptyError ? <p>{"Username empty"}</p> : ""}</div>
                <p>{accountVerified ? "We have sent a verification email to " + inputs.email : ""}</p>
            </div>
        </div>
    );
}

export default SignUp;