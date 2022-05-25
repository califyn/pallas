import React, { useState, useEffect } from 'react'

let checkLoginFunc = null;

export function fetchP(...args) {
    return fetch(...args).then(res => {
        if (res.status === 401) {
            checkLoginFunc();
        }
        return res;
    });
}

export default function LoginWrapper({ children }) {
	const [loggedIn, setLoggedIn] = useState(false);
    const [incorrectLogin, setIncorrectLogin] = useState(false);

	async function checkLogin() {
        if (localStorage.getItem("token") === null) {
            setLoggedIn(false);
        }

		fetch("/api/priv/profile?" + new URLSearchParams({
			"secret_token": localStorage.getItem("token")
		})).then(res => {
            if (res.status === 401) {
                setLoggedIn(false);
            } else if (res.status === 200) {
                setLoggedIn(true);
            } else {
                throw new Error(res.status)
            };
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
		}).then(res => {
            if (res.status === 500) {
                return res.json().then(obj => { 
                    if (obj.errorString.includes("login was incorrect")) {
                        setIncorrectLogin(true);
                    }
                    throw new Error(res.status);    
                });
            } else { return res; }
        })
        .then(res => res.json())
		.then(res => res["token"])
		.then(token_ => {
            localStorage.setItem("token", token_);
            checkLogin();
        });
	}

	useEffect(() => {
        checkLoginFunc = checkLogin;
        checkLogin();
    });

    // incorrect login does not persist
    useEffect(() => {
        setIncorrectLogin(false);
    }, [loggedIn]);

	return (
		<>
            {incorrectLogin && <p>Username or password is incorrect</p>}
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
