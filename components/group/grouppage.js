import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchGet } from '../login'
import { getUser } from '../utils'

import MiniProfile from '../profile/miniprofile'

export default function GroupPage(props) {
    let params = useParams();
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [group, setGroup] = useState({});

    useEffect(() => {
        fetchGet("group-info", {
            "name": params.group
        }).then(res => res.json())
        .then(res => res.group)
        .then(group => setGroup(group));
    });

    return (
        <div className="group-page">
            <h1>{group.name}</h1>

            <h2>Admins</h2>
            {group.admins !== undefined && group.admins.map(admin => <MiniProfile id={admin} key="admin-{admin}"/>)}

            <h2>Users</h2>
            {group.users !== undefined && group.users.map(user => <MiniProfile id={user} key="user-{user}"/>)}
        </div>
    );
}

