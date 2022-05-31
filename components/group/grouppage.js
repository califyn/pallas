import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchGet, fetchPost } from '../login'
import { getUser } from '../utils'

import MiniProfile from '../profile/miniprofile'

export default function GroupPage(props) {
    let params = useParams();
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [group, setGroup] = useState({});
    const [addUserState, setAddUserState] = useState('default');
    const [userToAdd, setUserToAdd] = useState(null);
    const [errorText, setErrorText] = useState(null);

    useEffect(() => {
        fetchGet("group-info", {
            "name": params.group
        }).then(res => res.json())
        .then(res => res.group)
        .then(group => setGroup(group));
    });

    async function addUser(e) {
        e.preventDefault();
        
        const form = e.target;
        const username = form[0].value;

        fetchPost("/group-add-user", {
            groupname: group.name,  
            username: username,  
        }).then(res => {
            if (res.ok) {
                res.json().then(obj => {
                    if (obj.success) {
                        setAddUserState('user-added');
                    } else {
                        setErrorText(obj.message); 
                    }
                });
            } else {
                res.json().then(obj => setErrorText(obj.errorString));
                throw new Error(obj.errorString);
            }
        });
    }

    return (
        <div className="group-page">
            <h1>{group.name}</h1>

            <h2>Admins</h2>
            {group.admins !== undefined && group.admins.map(admin => <MiniProfile id={admin} key="admin-{admin}"/>)}

            <h2>Users</h2>
            {group.users !== undefined && group.users.map(user => <><MiniProfile id={user} key={"user" + user}/><br /></>)}
            {errorText !== null && 
                <>
                    <p><i>Error: {errorText}</i></p>
                </>
            }
            <br />
            {(() => {
                switch (addUserState) {
                    case 'default':
                        return (
                            <>
                                <button onClick={() => setAddUserState('enter-username')}>Add user</button>
                            </>
                        );
                    case 'enter-username':
                        return (
                            <>
                                <form onSubmit={event => addUser(event)}>
                                    <label htmlFor="username-field">Enter in their username.</label>
                                    <input type="text" name="username-field"/>
                                    <input type="submit" value="Add user"/>
                                </form>
                            </>
                        );
                    case 'user-added':
                        return (
                            <>
                                <p>The user <strong>{userToAdd}</strong> has been added.</p>
                                <button onClick={() => setAddUserState('enter-username')}>Add another user</button>
                            </>
                        ); 
                }
            })()}
        </div>
    );
}

