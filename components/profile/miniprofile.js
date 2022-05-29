import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchGet } from '../login'
import { getUser } from '../utils'

export default function MiniProfile(props) {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        var obj = {};
        if (props.username != undefined) {
            obj.username = props.username;
        }
        if (props.id != undefined) {
            obj.id = props.id;
        }
        fetchGet("user-info", obj).then(res => {
            if (res.ok) {
                res.json().then(res => { 
                    setSelectedUser(res.user == null ? 'null' : res.user);
                });
            } else {
                throw new Error(res.status)
            };
        });
    });

    return (
        <span className="mini-profile">
            <a href={"/profile/" + selectedUser.username}>{selectedUser.username}</a>
        </span>
    );
}
