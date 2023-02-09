import React from "react"
import { useState, useEffect } from "react"
import '../styles/dmca.css';

function PrivacyPolicy() {

    //state for html
    const [html, setHTML] = useState(null);

    useEffect(() => {
        //gets privacy policy
        fetch("/api/open/privacyPolicy", { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setHTML(data);
            })
            .catch(err => {
                console.log(err);
                setHTML(err);
            })
    }, []);
    
    //returns html
    return (
        <React.Fragment>
            <div className="dmcaP">
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
        </React.Fragment>
    )
}

export default PrivacyPolicy;