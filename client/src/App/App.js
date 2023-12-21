import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../css/App.css';
import { useEffect, useState } from 'react';
import React from 'react';

import Home from '../pages/home';
import SignIn from '../pages/signin';
import Dashboard from '../pages/dashboard';
import Protect from '../guards/protect';
import SignUp from '../pages/signup';
import Redirect from '../pages/redirect';

import { updateSession } from '../utils/serverHandler';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loggedIn, setLoggedIn] = useState(Boolean(user))

  useEffect(() => {
    updateSession()
}, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirect user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login-google" element={<Home user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/signin" element={<SignIn setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/dashboard" element={
            <Protect loggedIn={loggedIn}>
              <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser} />
            </Protect>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );


}

export default App;
