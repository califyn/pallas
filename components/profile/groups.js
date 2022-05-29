import React, { useState, useEffect } from 'react'
import { fetchP, fetchPost, fetchGet } from '../login'
import { getUser } from '../utils'

import GroupPane from '../group/grouppane'

export default function ProfileGroups(props) {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => { getUser(setCurrentUser) }, [location]);

    const [groups, setGroups] = useState(undefined);
    const [canAddGroup, setCanAddGroup] = useState(false);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [groupErr, setGroupErr] = useState(null);

    function updateGroups() {
        fetchGet("list-groups", {
            "username": props.user
        }).then(res => res.json())
        .then(res => {
            setCanAddGroup(res.can_add_group);
            setGroups(res.groups);
        });
    }

    // get groups
    useEffect(updateGroups);

    async function createGroup(e) {
		e.preventDefault();
		
		const form = e.target;
		const group_name = form[0].value;

        fetchP("/api/priv/create-group", {
            method: "POST",
            headers: new Headers({
                "Authentication": localStorage.getItem("token"),
                "Content-type": "application/x-www-form-urlencoded",
            }),
            body: new URLSearchParams({
                "name": group_name,
            })
        }).then(res => {
            if (res.ok) {
                setIsAddingGroup(false);
                updateGroups();
            } else {
                res.json().then(obj => {
                    if (obj.errorString.includes("name_1 dup key:")) {
                        setGroupErr("Group name has already been used");
                    } else {
                        throw new Error('group error');
                    }
                });
            }
        });
    }

    useEffect(() => {
        setGroupErr(null);
    }, [isAddingGroup]);

    return (
        <>
            {groups !== undefined && 
                <>
                    <h2>Groups</h2>
                    {groups.length == 0 && <p><i>This user is in no groups.</i></p>}
                    {groups.map(group => <GroupPane group={group} key={group}/>)}
                    {(canAddGroup && (props.user === undefined || props.user == currentUser.username)) && 
                        <>
                            {
                                isAddingGroup 
                                && <form onSubmit={event => createGroup(event)}>
                                    { groupErr !== null && 
                                        <p>{groupErr}</p>
                                    }
                                    <label htmlFor="groupname-field">Group name:</label>
                                    <input type="text" id="groupname-field" />
                                    <input type="submit" />
                                </form>
                            }
                            <button id="add-group-button" onClick={() => { setIsAddingGroup(!isAddingGroup) }}>
                                {isAddingGroup ? 'Cancel' : 'Add Group'}
                            </button> 
                        </>
                    }
                </>
            }
        </>
    );
}

