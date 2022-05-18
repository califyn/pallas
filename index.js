import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

require("regenerator-runtime/runtime");

import Login from './components/login.js'

function App() {
	return <div><Login /></div>
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
