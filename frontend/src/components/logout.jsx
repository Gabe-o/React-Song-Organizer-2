import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import React from "react";
import "../styles/navbar.css";

function Logout(){

    //logout button in nav bar
    const navigate = useNavigate();
    const logout = () => {
        signOut(auth).then(() => {
            navigate("/home", {replace: true});
        })
        .catch((error) => {
            alert("Problem logging out");
        });
    }

    return(
        <React.Fragment>
            <button className="navBarB" onClick={logout}>Log Out</button>
        </React.Fragment>
    )
}

export default Logout;