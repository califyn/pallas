import React, { useState, useEffect } from 'react'
import { fetchP } from '../login'

export default function EmailSettings(props) {
    const [formState, setFormState] = useState('default');
    const [errorText, setErrorText] = useState(null);

    async function genEmailKey(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form[0].value;
        
        fetchP("/api/priv/initiate-email-reset", {
            method: "POST",
            headers: {
                "Authentication": localStorage.getItem("token"),
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "email": email
            })
        }).then(res => {
            if (!res.ok) {
                res.json().then(obj => setErrorText(obj.errorString));
                throw new Error(obj.errorString);
            } else {
                return res;
            }
        }).then(() => setFormState('verify-key'));
    }

    async function checkEmailKey(e) {
        e.preventDefault();
        
        const form = e.target;
        const key = form[0].value;
        
        fetch("/api/priv/verify-email-reset", {
            method: "POST",
            headers: {
                "Authentication": localStorage.getItem("token"),
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "key": key 
            })
        }).then(res => {
            if (!res.ok) {
                res.json().then(obj => setErrorText(obj.errorString));
                throw new Error(obj.errorString);
            } else {
                return res;
            }
        }).then(res => res.json())
        .then(success => { if (success) setFormState('default'); });
    }

    return ( 
        <>
            {errorText !== null && <p>{errorText}</p>}
            {(() => {
                switch(formState) {
                    case 'default':
                        return (
                            <>
                                <p className="settings-field">{props.email}</p>
                                <button onClick={() => setFormState('enter-email')}>Change email</button>
                            </>
                        );
                    case 'enter-email':
                        return (
                            <>
                                <form onSubmit={event => genEmailKey(event)}>
                                    <label htmlFor="email-field">Enter in your new email.</label>
                                    <input type="email" name="email-field"/>
                                    <input type="submit" value="Generate key" />
                                </form>
                                <button onClick={() => setFormState('default')}>Cancel</button>
                            </>
                        );
                    case 'verify-key':
                        return (
                            <>
                                <form onSubmit={event => checkEmailKey(event)}>
                                    <label htmlFor="ekey-field">Enter in the verifcation key sent to your new email.</label>
                                    <input type="text" name="ekey-field"/>
                                    <input type="submit" value="Verify key" />
                                </form>
                                <button onClick={() => setFormState('default')}>Cancel</button>
                            </>
                        );
                }
            })()}
        </>
    );
}
