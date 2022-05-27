import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

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
    const [currentUser, setCurrentUser] = useState(null);

	async function checkLogin() {
        if (localStorage.getItem("token") === null) {
            setLoggedIn(false);
        }

		fetch("/api/priv/user-info?" + new URLSearchParams({
			"secret_token": localStorage.getItem("token")
		})).then(res => {
            if (res.status === 401) {
                setLoggedIn(false);
            } else if (res.status === 200) {
                res.json().then(res => setCurrentUser(res.user))
                    .then(() => { setLoggedIn(true); });
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
            
            {loggedIn ? ( 
                <>
                    <nav>
                        <p className="identifier">pallas</p>
                        <p className="welcome">{currentUser.username}</p>
                        <NavLink className={({ isActive }) => isActive && "activeLink" } to=""><img src="icons/nav_dashboard.svg" /> dashboard</NavLink>
                        <NavLink className={({ isActive }) => isActive && "activeLink" } to="profile"><img src="icons/nav_profile.svg" /> profile</NavLink>
                        <NavLink className={({ isActive }) => isActive && "activeLink" } to="settings"><img src="icons/nav_settings.svg" /> settings</NavLink>
                        <NavLink className={({ isActive }) => isActive && "activeLink" } to="wiki"><img src="icons/nav_wiki.svg" /> wiki</NavLink>
                        <Link to="" onClick={() => { localStorage.removeItem('token'); checkLogin() }} id="nav-logout"><img src="icons/nav_logout.svg" /> logout</Link>
                    </nav>
                    <div id="page-body">
                        { children }
                    </div>
                </> 
                ) : (
                <div className='loginPanel'>
                    {incorrectLogin && <p className="error-text">Username or password is incorrect</p>}
                    <p className="panelSubtitle">pallas</p>
                    <p className="panelTitle">Login</p>
                    <form onSubmit={event => login(event)}>
                        <label htmlFor="username-field">Username</label>
                        <input type="text" id="username-field" name="login-field" />
                        <label htmlFor="password-field">Password</label>
                        <input type="password" id="password-field" name="password-field" />
                        <input type="submit" value="Enter"/>
                    </form>
                    <p><Link to="/register">Register</Link></p>
                    <p><Link to="/reset-password">Forgot password?</Link></p>
                </div>
            )}
		</>
	);
}
