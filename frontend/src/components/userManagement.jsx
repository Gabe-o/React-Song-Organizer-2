import { useState } from "react";
import UserInfo from "./userInfo";
import React from "react";
import { useEffect } from 'react';

function UserManagement() {

    //state for users
    const [users, setUsers] = useState([]);

    useEffect(() => {
        //gets all usernames
        fetch("/api/admin/usernames", { method: "GET", headers: new Headers({ 'Content-Type': 'application/json' }) })
            .then(res => res.json())
            .then(data => {
                setUsers(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    //returns information on all users
    return (
        <div>
            <React.Fragment>
                {users.map((user) => <UserInfo {...user} key={user.id} />)}
            </React.Fragment>
        </div>
    )

}

export default UserManagement;
