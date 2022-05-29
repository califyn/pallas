import React, { useState, useEffect } from 'react'
import { fetchP } from './login'
import { getUser } from './utils'

import EmailSettings from './settings/email'
import PasswordSettings from './settings/password'

export default function Settings(props) {
    const [currentUser, setCurrentUser] = useState({username: null, email: null});

    useEffect(() => { getUser(setCurrentUser); }, [location]);

    return (
        <div id="settings">
            <h1>Settings</h1>

            <h2>User</h2>

            <h4>Username</h4>
            <p className="settings-field">{currentUser.username}</p>
            <p><i>To change your username, please contact the webmaster.</i></p>

            <h4>Email</h4>
            <EmailSettings />

            <h4>Password</h4>
            <PasswordSettings />

            <h4>Access level</h4>
            <p className="settings-field">{currentUser.access_level}</p>
        </div>
    );
}
