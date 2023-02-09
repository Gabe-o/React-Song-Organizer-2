import React from "react"
import { useState, useEffect } from "react"
import '../styles/dmca.css';

function TakedownPolicy() {

    //state html
    const [html, setHTML] = useState(null);

    useEffect(() => {
        //gets admin inputted takedown policy
        fetch("/api/open/takedownPolicy", { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
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

    //displays takedown policy
    return (
        <React.Fragment>
            <div className="dmcaP">
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
        </React.Fragment>
    )
}

export default TakedownPolicy;