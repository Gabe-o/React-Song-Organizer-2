import React from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/homePage.css"
function HomePage() {

    let navigate = useNavigate();
    const loginPage = () => {
        navigate("/login");
    };

    //returns home page with text
    return (
        <div className='defaultMargin'>
            <h1>Free Music Archive ReST API</h1>
            <h2>Made By Gabe Olivotto, Nico Moniz, and Ayush Sharma</h2>
            <p className='paragraph'>We took information from Free Music Archive, and made a ReST API that allows you to search through tracks using track, album, genre, and artist names. We also added a playlist functionality that allows you to create a playlist, add songs to a playlist, publish your playlist, and view other public published playlists.</p>
            <p className='paragraph'>To create an account, go to the Login tab, and sign up. Or, if you're a returning user, login.</p>
            <p className='paragraph'>You can use this website without making an account, however your functionality is limited to searching tracks and viewing public playlists.</p>
            <p className='paragraph'>To make your own playlists, you need an account.</p>
        </div>
    );
}

export default HomePage;