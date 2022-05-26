import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

require("regenerator-runtime/runtime");

import LoginWrapper from './components/login.js'
import Profile from './components/profile.js'
import Register from './components/register.js'
import ResetPassword from './components/reset-password.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element = { <Register /> } />
                <Route path="/reset-password" element = { <ResetPassword /> } />
                <Route path="/*" element={ <LoginWrapper><Outlet /></LoginWrapper> }>
                    <Route path="" element={ <Profile /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
