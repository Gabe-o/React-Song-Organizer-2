import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from "../firebase";

const AdminWrapper = () => {

    //sets user and loadingState states
    const [user, setUser] = useState({});
    const [loadingState, setLoadingState] = useState("loading");

    useEffect(() => {
        try {
            //try to check if user is valid
            fetch("/api/open/usernames/" + auth.currentUser.uid, { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
                .then(res => res.json())
                .then(data => {
                    setLoadingState("Complete");
                    setUser(data); 
                })
                .catch(err => {
                    console.log(err);
                });
        }
        catch (err) {
            setLoadingState("Complete");
            console.log("Not logged in");
        }
    }, []);

    //returns to home page
    return (loadingState === "Complete" ? ((auth.currentUser != null && user[0].admin === "true") ? <Outlet /> : <Navigate to="/home" />) : "");
}

export default AdminWrapper;

