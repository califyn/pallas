import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchP } from './login'
import { getUser } from './utils'

import ProfileGroups from './profile/groups'

export default function Profile(props) {
    let params = useParams();
    const [currentUser, setCurrentUser] = useState({username: null, email: null});
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    useEffect(() => {
        if (params.user !== undefined) {
            fetchP("/api/priv/user-info?" + new URLSearchParams({
                "secret_token": localStorage.getItem("token"),
                "username": params.user
            })).then(res => {
                if (res.ok) {
                    res.json().then(res => { 
                        setSelectedUser(res.user == null ? 'null' : res.user);
                    });
                } else {
                    throw new Error(res.status)
                };
            });
        } else {
            setSelectedUser(currentUser);
        }
    });

    return ( 
        <div id="user-profile" key={selectedUser.username}>
            { selectedUser != 'null' ? (
                    <>
                        <h1>{selectedUser.username}</h1>

                        <h2>User Info</h2>
                        <p className="profile-field"><strong>username</strong> {selectedUser.username}</p>
                        {selectedUser.email !== undefined && <p className="profile-field"><strong>email</strong> {selectedUser.email}</p>}
                        {selectedUser.access_level !== undefined && <p className="profile-field"><strong>access level</strong> {selectedUser.access_level}</p>}

                        <ProfileGroups user={selectedUser.username} key={selectedUser.username}/>
                    </>
                ) : (
                    <>
                        <p><i>You do not have permission to view this user.</i></p>
                    </>
                )
            }
        </div>
    );
}
