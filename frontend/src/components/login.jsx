import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import "../styles/login.css"

function Login() {

    //sends and gets JSON Web Token between website and firebase
    const getJWT = (username) => {
        fetch("/api/open/usernames/login",
            {
                method: "POST",
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    "username": username
                })
            })
            .then(httpResp => {
                return httpResp.json().then(data => {
                    if (httpResp.ok) {
                        document.cookie = `token=${data.accessToken}`;
                    }
                    else {
                        throw new Error(httpResp.status + "\n" + JSON.stringify(data));
                    }
                })
            })
            .catch(err => {
                throw err;
            });
    }

    //log in with google
    let navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
                fetch("/api/open/usernames/" + auth.currentUser.uid, { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
                    .then(res => res.json())
                    .then(data => {
                        if (data.length === 0 && auth.currentUser != null) {
                            fetch("/api/open/usernames/insertGoogleUser", { method: "POST", body: JSON.stringify({ "username": auth.currentUser.displayName, "id": auth.currentUser.uid }), headers: new Headers({ 'Content-Type': 'application/json' }) })
                                .then(res => res.json())
                                .then(data => {
                                    getJWT(auth.currentUser.uid);
                                    navigate("/home");
                                })
                                .catch(err => {
                                    alert("Error");
                                });
                        }

                        else if (auth.currentUser != null && data[0].activated === "true") {
                            getJWT(auth.currentUser.uid);
                            navigate("/home");
                        }
                        else if(data[0].activated === "false"){
                            alert("Your account has been disabled. Please contact your administrator!");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
        })
            .catch((err) => {
                console.log(err);
            });
    }
    const signUpPage = () => {
        navigate("/signUp");
    }

    //sets state for user input and errors
    const [inputs, setInputs] = useState({});
    const [emailEmptyError, setEmailError] = useState(false);
    const [passwordEmptyError, setPasswordError] = useState(false);

    //gets input from user
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const signIn = (e) => {

        e.preventDefault();

        setEmailError(false);
        setPasswordError(false);

        const email = inputs.email;
        const password = inputs.password;

        if ((email === undefined || email === "") || (password === undefined || password === "")) {
            if (email === undefined || email === "") {
                setEmailError(true);
            }
            if (password === undefined || password === "") {
                setPasswordError(true);
            }
        }

        //sign in with email and password through firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                fetch("/api/open/usernames/" + user.uid, { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
                    .then(res => res.json())
                    .then(data => {
                        // logged in successfully
                        if (user != null && user.emailVerified && data[0].activated === "true") {
                            getJWT(auth.currentUser.uid);
                            navigate("/home");
                        }

                        else if (data[0].activated === "false") {
                            alert("Your account has been disabled. Please contact your administrator!");
                        }

                        else {
                            sendEmailVerification(user).then(() => {
                                alert("Your account isn't verified. We have send an email to " + inputs.email + " with a link to verify your account.")
                            })
                                .catch(() => {
                                    alert("A verification email has already been sent! Please wait a bit before sending another!");
                                })
                        }
                    })
                    .catch(err => {
                        console.log("Error");
                    })
            })
            .catch((error) => {
                alert("Login unsuccsesful");
            });
    }

    const homePage = () => {
        navigate("/home", { replace: true });
    }

    //returns login page with inputs for username and password
    return (
        <div className="mainDIV">
            <div className='container1'>
                <h1 className='Login'>Log In</h1>
                <form onSubmit={signIn}>
                    <input className='loginInput' type="text" name="email" onChange={handleChange} placeholder="Email" value={inputs.email || ""} /><br></br><br></br>
                    <input className='loginInput' type="password" name="password" onChange={handleChange} placeholder="Password" value={inputs.password || ""} /><br></br><br></br>
                    <button type="submit" className='loginB'>Login</button>
                </form>
                <h1 className='Login'>{emailEmptyError ? "Email empty " : " "} {passwordEmptyError ? "Password empty " : " "}</h1>
                <br></br><br></br>
                <h1 className='Login'>Or Log In With Google</h1>
                <button className='loginB' onClick={signInWithGoogle}>Login With Google</button><br></br>
            </div>
            <div className='container2'>
                <h1>New User? Sign Up with Email Below</h1><br></br>
                <button className='loginB' onClick={signUpPage}>Sign Up</button><br /><br /><br />
                <h1>Or Go Back To The Home Page</h1>
                <button className='loginB' onClick={homePage}>Back to Home Page</button>
            </div>
        </div>
    );
}

export default Login;