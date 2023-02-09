import React from "react";

function TakedownProcedureDocument() {

    //returns text of takedown procedure
    return (
        <React.Fragment>
            <h2>DMCA takedown procedure</h2>
            <p>1. Upon receiving a valid DMCA takedown request, locate the infringing review, log the date the request was received in the reviews corresponding input field and hide the reviews visability.</p>
            <br />
            <p>2. Send a notice to the user in question that is associated with the review and log the date this notice was sent in the reviews corresponding input field.</p>
            <br />
            <p>3. If a dispute is filed by the user, log the date it was received and forward it to the original sender of the copyright takedown request or take appropriate action.</p>
            <br />
            <p>4. If the claimant does not take action to any disputed claims within 14 days set the review&rsquo;s visibility to not hidden.&nbsp;</p>
        </React.Fragment>
    )
}

export default TakedownProcedureDocument;