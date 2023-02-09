import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Logout from "./logout";
import "../styles/navbar.css";
function Navbar() {

    //state for username and hasAdmin
    const [username, setUsername] = useState("");
    const [hasAdmin, setAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            //checks if user is admin
            fetch("/api/open/usernames/" + auth.currentUser.uid, { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
                .then(res => res.json())
                .then(data => {
                    if (data[0].admin === "true") {
                        setAdmin(true);
                        setUsername(data[0].username + " (ADMINISTRATOR)");
                    }
                    else {
                        setAdmin(false);
                        setUsername(data[0].username);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        catch (err) {
            console.log("Not Logged In");
        }
    });

    //all buttons in nav bar
    const homeButton = () => {
        navigate("/home", { replace: true });
    }

    const loginButton = () => {
        navigate("/login", { replace: true });
    }

    const tracksButton = () => {
        navigate("/tracks", { replace: true });
    }

    const searchPlaylistButton = () => {
        navigate("/playlists", { replace: true });
    }

    const managePlaylistButton = () => {
        navigate("/managePlaylists", { replace: true });
    }

    const policiesButton = () => {
        navigate("/policies", { replace: true });
    }

    const manageUsersButton = () => {
        navigate("/manageUsers", { replace: true });
    }

    const manageReviewsButton = () => {
        navigate("/manageReviews", { replace: true });
    }

    const manageAccountButton = () => {
        navigate("/manageAccount", { replace: true });
    }

    const DMCAButton = () => {
        navigate("/manageDMCA", { replace: true });
    }

    //returns button in nav bar
    return (
        <div>
            <nav>
                <div className="navBarDiv">
                    <h1 className="welcomeh1">WELCOME {auth.currentUser === null ? "GUEST" : username} </h1>
                    <ul>
                        <li>
                            <button className="navBarB" onClick={homeButton}>Home</button>
                        </li>

                        <li>
                            <button className="navBarB" onClick={tracksButton}>View/Search Tracks</button>
                        </li>
                        <li>
                            <button className="navBarB" onClick={searchPlaylistButton}>Search Playlists</button>
                        </li>
                        <li>
                            <button className="navBarB" onClick={policiesButton}>Policies</button>
                        </li>
                        <li>
                            {auth.currentUser != null ? <button className="navBarB" onClick={manageAccountButton}>Manage Account</button> : null}
                        </li>
                        <li>
                            {auth.currentUser != null ? <button className="navBarB" onClick={managePlaylistButton}>Create/Edit Playlist</button> : null}
                        </li>
                        <li>
                            {((auth.currentUser != null) && hasAdmin) ? <button className="navBarB" onClick={manageUsersButton}>Edit Users</button> : null}
                        </li>
                        <li>
                            {((auth.currentUser != null) && hasAdmin) ? <button className="navBarB" onClick={manageReviewsButton}>Edit Reviews</button> : null}
                        </li>
                        <li>
                            {((auth.currentUser != null) && hasAdmin) ? <button className="navBarB" onClick={DMCAButton}>Manage Policies</button> : null}
                        </li>
                        <li>
                            {auth.currentUser === null ? <button className="navBarB" onClick={loginButton}>Login</button> : <Logout />}
                        </li>
                    </ul>
                </div>
            </nav> <br></br><br></br>
        </div>
    )
}

export default Navbar;