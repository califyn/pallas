import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [ errorText, setErrorText ] = useState(null);
    const [ registeredUser, setRegisteredUser ] = useState(null);

    async function register(e) {
        e.preventDefault();

        const form = e.target;
        const username = form[0].value;
        const email = form[1].value;

        fetch("/api/signup", {
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
        .then(res => setRegisteredUser({username: res.username, email: res.email }));
    }


    return (
        <div className='loginPanel'>
            {registeredUser === null ? (
                <>
                    <form onSubmit={event => register(event)}>
                        <label htmlFor="username-field">Username:</label>
                        <input type="text" id="username-field" name="login-field" />
                        <label htmlFor="email-field">Email:</label>
                        <input type="email" id="email-field" name="email-field" />
                        <input type="submit" />
                    </form>
                    <p>Already have an account? <Link to="/">Log in</Link></p>
                </>
            ) : (
                <>
                    <p>You have registered a new user.</p>

                    <p><strong>Username:</strong> {registeredUser.username}</p>
                    <p><strong>Email:</strong> {registeredUser.email}</p>

                    <p>Please check your email for the password to log in.</p>

                    <Link to="/">Log in</Link>
                </>
            )}
        </div>
    );
}
