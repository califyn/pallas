import React, { useState, useEffect } from 'react'

export default function LoginWrapper({ children }) {
	const [loggedIn, setLoggedIn] = useState(false);

	async function checkLogin() {
        if (localStorage.getItem("token") === null) {
            setLoggedIn(false);
        }

        console.log(localStorage.getItem("token"));
		fetch("/api/priv/profile?" + new URLSearchParams({
			"secret_token": localStorage.getItem("token")
		})).then(res => {
            console.log(res.status);
            if (res.status === 401) {
                setLoggedIn(false);
            } else if (res.status === 200) {
                setLoggedIn(true);
            } else {
                throw new Error(res.status)
            };
            console.log(loggedIn);
        });
	}

	async function login(e) {
		e.preventDefault();
		
		const form = e.target;
		const username = form[0].value;
		const password = form[1].value;

		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				"username": username,
				"password": password
			})
		}).then(res => res.json())
		.then(res => res["token"])
		.then(token_ => {
            localStorage.setItem("token", token_);
            checkLogin();
        });
	}

	useEffect(() => {
        checkLogin();
    });

	return (
		<>
            {loggedIn ? React.cloneElement(children, { checkLogin: checkLogin }) : (
                <form onSubmit={event => login(event)}>
                    <label htmlFor="username-field">Username:</label>
                    <input type="text" id="username-field" name="login-field" />
                    <label htmlFor="password-field">Password:</label>
                    <input type="password" id="password-field" name="password-field" />
                    <input type="submit" />
                </form>
            )}
		</>
	);
}
