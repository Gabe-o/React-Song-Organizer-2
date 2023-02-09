import React from "react";
import ChangePassword from "./changePassword";
import ChangeUsername from "./changeUsername";
function ManageAccount() {

    //returns both change username component and change password component
    return (
        <div>
            <React.Fragment>
                <ChangeUsername />
                <br></br>
                <ChangePassword />
            </React.Fragment>
        </div>
    )

}

export default ManageAccount;