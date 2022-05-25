import React, { useState, useEffect } from 'react'
import { fetchP } from './login'

export default function Profile(props) {
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [userText, setUserText] = useState("");

    const [isAddingGroup, setIsAddingGroup] = useState(false);
    
    const [groupErr, setGroupErr] = useState(null);

    // get user
    useEffect(() => {
        fetchP("/api/priv/profile?" + new URLSearchParams({
            "secret_token": localStorage.getItem("token")
        })).then(res => res.json())
        .then(res => res.user)
        .then(user => {
            setCurrentUser(user);
            setUserText(user.username);
        });
    });

    function updateGroups() {
        fetchP("/api/priv/list-groups?" + new URLSearchParams({
            "secret_token": localStorage.getItem("token")
        })).then(res => res.json())
        .then(res => res.groups)
        .then(groups => {
            setGroups(groups);
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
        <div id="user-profile">
            <p>Welcome, {userText}!</p>
            <button id="logout-button" onClick={() => { localStorage.removeItem('token'); props.checklogin() }}> Logout </button>
            {groups.map(group => { 
                return (
                    <div className="group-panel" key={group.name}>
                        <p>Group <i>{group.name}</i></p>
                    </div>
                );
            })}
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
        </div>
    );
}
