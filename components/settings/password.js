import React, { useState, useEffect } from 'react'
import { fetchP } from '../login'

export default function PasswordSettings(props) {
    const [formState, setFormState] = useState('default');
    const [newPassword, setNewPassword] = useState(null);
    const [errorText, setErrorText] = useState(null);

    async function storePassword(e) {
        e.preventDefault();

        const form = e.target;
        const password = form[0].value;

        setNewPassword(password);
        setFormState('confirm-password');
    }

    async function changePassword() {
        fetchP("/api/priv/change-password", {
            method: "POST",
            headers: {
                "Authentication": localStorage.getItem("token"),
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "password": newPassword
            })
        }).then(res => {
            if (!res.ok) {
                res.json().then(obj => setErrorText(obj.errorString));
                throw new Error(obj.errorString);
            } else {
                return res;
            }
        }).then(() => setFormState('default'));
    }

    return ( 
        <>
            {errorText !== null && <p>{errorText}</p>}
            {(() => {
                switch(formState) {
                    case 'default':
                        return (
                            <>
                                <button onClick={() => setFormState('enter-password')}>Change password</button>
                            </>
                        );
                    case 'enter-password':
                        return (
                            <>
                                <form onSubmit={event => storePassword(event)}>
                                    <label htmlFor="password-field">Enter in your new password.</label>
                                    <input type="text" name="password-field"/>
                                    <input type="submit" value="Continue" />
                                </form>
                                <button onClick={() => setFormState('default')}>Cancel</button>
                            </>
                        );
                    case 'confirm-password':
                        return (
                            <>
                                <p style={{margin: "0"}}>Your new password will be: <strong>{newPassword}</strong></p>
                                <button onClick={changePassword}>Confirm</button>
                                <br />
                                <button onClick={() => setFormState('default')}>Cancel</button>
                            </>
                        );
                }
            })()}
        </>
    );
}
