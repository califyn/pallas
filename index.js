import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

function App() {
 	const style = {
		padding: '40px',
		textAlign: 'center'
	}

	const [count, setCount] = useState(-1);

	useEffect(() => {
		fetch("/api/")
		.then(res => res.json())
		.then(data => setCount(data['num']));
	}, []);

	return <div style={style}>{count}</div>
}

ReactDOM.render(<App />, document.querySelector('#app'))
