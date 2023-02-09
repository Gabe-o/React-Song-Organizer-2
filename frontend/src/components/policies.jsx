import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homePage.css";
import "../styles/policies.css";

function Policies() {

    //buttons to guide to each policy
    const navigate = useNavigate();

    const privacyPolicyButton = () => {
        navigate("/privacyPolicy", { replace: true });
    }

    const takedownPolicyButton = () => {
        navigate("/takedownPolicy", { replace: true });
    }

    const acceptableUsePolicyButton = () => {
        navigate("/acceptableUsePolicy", { replace: true });
    }

    //returns a page of buttons
    return (
        <React.Fragment>
            <div className="defaultMargin">
                <button className="privacyButton" onClick={privacyPolicyButton}>Privacy Policy</button>
                <button className="privacyButton" onClick={takedownPolicyButton}>Takedown Policy</button>
                <button className="privacyButton" onClick={acceptableUsePolicyButton}>Acceptable Use Policy</button>
            </div>
        </React.Fragment>
    )
}
export default Policies;