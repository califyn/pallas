import React, { useState, useEffect } from 'react'

export default function Login() {
	const [infoText, setInfoText] = useState("");

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
		}).then(res => res.text())
		.then(text => setInfoText(text));
	}

	return <div id="login-panel">
		<form onSubmit={event => login(event)}>
			<label htmlFor="username-field">First name:</label>
			<input type="text" id="username-field" name="login-field" />
			<label htmlFor="password-field">Last name:</label>
			<input type="password" id="password-field" name="password-field" />
			<input type="submit" />
		</form>

		<div id="user-info-area">
			<p id="user-info">{infoText}</p>
		</div>
	</div>;
}
