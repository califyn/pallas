import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
    const [ errorText, setErrorText ] = useState(null);
    const [ resetUser, setResetUser ] = useState(null);

    async function reset(e) {
        e.preventDefault();

        const form = e.target;
        const username = form[0].value;
        const email = form[1].value;

        fetch("/api/reset-password", {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "username": username,
                "email": email
            })
        }).then(res => {
            if (!res.ok) {
                res.json().then(obj => setErrorText(obj.errorString));
                throw new Error(obj.errorString);
            } else {
                return res;
            }
        }).then(res => res.json())
        .then(res => setResetUser({username: res.username, email: res.email }));
    }


    return (
        <div className='loginPanel'>
            {resetUser === null ? (
                <>
                    {errorText !== null && <p>{errorText}</p>}
                    <form onSubmit={event => reset(event)}>
                        <label htmlFor="username-field">Username:</label>
                        <input type="text" id="username-field" name="login-field" />
                        <label htmlFor="email-field">Email:</label>
                        <input type="email" id="email-field" name="email-field" />
                        <input type="submit" />
                    </form>
                    <p>Suddenly remembered? <Link to="/">Log in</Link></p>
                    <p>Forgot either your username or email? Contact the webmaster.</p>
                </>
            ) : (
                <>
                    <p>You have reset your password, for the user <strong>{resetUser.username}</strong>.</p>

                    <p>Please check your email for an automatically generated password. You may use that password to login again and change your password.</p>

                    <Link to="/">Log in</Link>
                </>
            )}
        </div>
    );
}
