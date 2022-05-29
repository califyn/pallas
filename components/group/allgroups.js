import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { fetchGet } from '../login'
import { getUser } from '../utils'

import GroupPane from './grouppane'

export default function AllGroups(props) {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [groupList, setGroupList] = useState([]);

    useState(() => {
        fetchGet("all-groups", {}).then(res => {
            if (res.ok) {
                return res;
            } else {
                setGroupList(null);
                throw new Error(res.status);
            }
        }).then(res => res.json())
        .then(res => res.groups)
        .then(groups => setGroupList(groups));
    });

    return (
        <div className="all-groups">
            {groupList != null ? (
                    <>
                        {groupList.map(group => <GroupPane group={group} key={group}/>)}
                    </>
                ) : (
                    <>
                        <i>You do not have permission to view groups.</i>
                    </>
                )
            }
        </div>
    ); 
}
