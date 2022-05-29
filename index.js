import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

require("regenerator-runtime/runtime");

import LoginWrapper from './components/login.js'

import Profile from './components/profile.js'
import AllGroups from './components/group/allgroups.js'
import GroupPage from './components/group/grouppage.js'
import Dashboard from './components/dashboard.js'
import Settings from './components/settings.js'
import Wiki from './components/wiki.js'
import PageNotFound from './components/notfound.js'

import Register from './components/register.js'
import ResetPassword from './components/reset-password.js'

// Create history object.
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

// Listen to history changes.
// You can unlisten by calling the constant (`unlisten()`).
const unlisten = history.listen((location, action) => {
  console.log(action, location.pathname, location.state);
});

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element = { <Register /> } />
                <Route path="/reset-password" element = { <ResetPassword /> } />
                <Route path="/*" element={ <LoginWrapper><Outlet /></LoginWrapper> }>
                    <Route path="" element={ <Dashboard /> } />
                    <Route path="profile" element={ <Profile /> }>
                        <Route path=":user" element={ <Profile /> } />
                    </Route>
                    <Route path="groups/:group" element={ <GroupPage /> } />
                    <Route path="settings" element={ <Settings /> } />
                    <Route path="wiki" element={ <Wiki /> } />
                    <Route path="*" element={ <PageNotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
