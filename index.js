import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

require("regenerator-runtime/runtime");

import LoginWrapper from './components/login.js'
import Profile from './components/profile.js'

function App() {
    return (
        <LoginWrapper>
            <Profile />
        </LoginWrapper>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
