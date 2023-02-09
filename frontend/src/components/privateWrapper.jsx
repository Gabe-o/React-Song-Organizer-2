import React from "react";
import {Navigate, Outlet} from 'react-router-dom';
import {auth} from "../firebase";

const PrivateWrapper = () => {
    return ((auth.currentUser != null) ? <Outlet/> : <Navigate to="/login"/>);
  };

export default PrivateWrapper;

