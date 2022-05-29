import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchGet } from '../login'
import { getUser } from '../utils'

export default function GroupPane(props) {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [group, setGroup] = useState({});

    useEffect(() => {
        fetchGet("group-info", {
            "group_id": props.group
        }).then(res => res.json())
        .then(res => res.group)
        .then(group => setGroup(group));
    });

    return (
        <>
            {group.users !== undefined &&
                <div className="group-pane-wrapper">
                    <div className="group-pane">
                        <div className="gpane-name-wrapper">
                            <h2 className="gpane-name">{group.name}</h2>
                        </div>
                        <div className="gpane-right">
                            {group.users !== undefined && <p className="gpane-users"><strong>{group.users.length}</strong> member{group.users.length != 1 && s}</p>}
                            {group.admins !== undefined && <p className="gpane-admins"><strong>{group.admins.length}</strong> admin{group.admins.length != 1 && s}</p>}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

