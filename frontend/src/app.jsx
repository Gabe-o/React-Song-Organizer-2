import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Tracks from "./components/tracks";
import Login from "./components/login";
import ManagePlaylists from './components/managePlaylists';
import PrivateWrapper from "./components/privateWrapper";
import HomePage from "./components/homePage";
import SignUp from "./components/signUp";
import Playlists from './components/playlists';
import AdminWrapper from './components/adminWrapper';
import UserManagement from './components/userManagement';
import Navbar from './components/navbar';
import ReviewManagment from './components/reviewManagement';
import ManageAccount from './components/manageAccount';
import DMCA from './components/dmca';
import CreatePrivacyPolicy from './components/createPrivacyPolicy';
import PrivacyPolicy from './components/privacyPolicy';
import CreateTakedownPolicy from './components/createTakedownPolicy';
import CreateAcceptableUsePolicy from './components/createAcceptableUsePolicy';
import TakedownPolicy from './components/takedownPolicy';
import AcceptableUsePolicy from './components/acceptableUsePolicy';
import TakedownProcedureDocument from './components/takedownProcedureDocument';
import Policies from './components/policies';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path="" element={<div><Navbar /><HomePage /></div>} />
                    <Route path="/home" element={<div><Navbar /><HomePage /></div>} />
                    <Route path="/tracks" element={<div><Navbar /><Tracks /></div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp/>} />
                    <Route path="/playlists"  element={<div><Navbar /><Playlists /></div>} />
                    <Route path="/policies" element={<div><Navbar /><Policies /></div>}/>
                    <Route path="/privacyPolicy"  element={<div><Navbar /><PrivacyPolicy /></div>} />
                    <Route path="/takedownPolicy"  element={<div><Navbar /><TakedownPolicy /></div>} />
                    <Route path="/acceptableUsePolicy"  element={<div><Navbar /><AcceptableUsePolicy /></div>} />
                    <Route element={<PrivateWrapper/>}>
                        <Route path="/manageAccount" element={<div><Navbar /><ManageAccount/></div>}/>
                        <Route path="/managePlaylists" element={<div><Navbar /><ManagePlaylists /></div>} />
                    </Route>
                    <Route element={<AdminWrapper/>}>
                        <Route path="/manageUsers" element={<div><Navbar /><UserManagement /></div>} />
                        <Route path="/manageReviews" element={<div><Navbar /><ReviewManagment /></div>} />
                        <Route path="/manageDMCA" element={<div><Navbar /><DMCA /></div>} />
                        <Route path="/createPrivacyPolicy" element={<div><Navbar /><CreatePrivacyPolicy/></div>} />
                        <Route path="/createTakedownPolicy" element={<div><Navbar /><CreateTakedownPolicy/></div>} />
                        <Route path="/createAcceptableUsePolicy" element={<div><Navbar /><CreateAcceptableUsePolicy/></div>} />
                        <Route path="/takedownProcedureDocument" element={<div><Navbar /><TakedownProcedureDocument/></div>} />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;