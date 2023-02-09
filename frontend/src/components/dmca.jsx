import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dmca.css";

function DMCA() {

    //sets navigate to their respective policy
    const navigate = useNavigate();
    const privacyPolicyButton = () => {
        navigate("/createPrivacyPolicy", { replace: true });
    }

    const takedownPolicyButton = () => {
        navigate("/createTakedownPolicy", { replace: true });
    }

    const acceptableUsePolicyButton = () => {
        navigate("/createAcceptableUsePolicy", { replace: true });
    }

    const takedownProcedureButton = () => {
        navigate("/takedownProcedureDocument", { replace: true });
    }

    //returns list of buttons
    return (
        <React.Fragment>
            <button className="dcmaButton" onClick={privacyPolicyButton}>Create and Edit Privacy and Security Policy</button>
            <button className="dcmaButton" onClick={takedownPolicyButton}>Create and Edit Takedown Policy</button>
            <button className="dcmaButton" onClick={acceptableUsePolicyButton}>Create and Edit Acceptable Use Policy</button>
            <button className="dcmaButton" onClick={takedownProcedureButton}>Takedown Procedure Document</button>
        </React.Fragment>
    )
}
export default DMCA;