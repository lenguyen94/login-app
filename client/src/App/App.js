import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../css/App.css';
import { useState } from 'react';
import React from 'react';

import Home from '../pages/home';
import SignIn from '../pages/signin';
import Dashboard from '../pages/dashboard';
import Protect from '../guards/protect';
import SignUp from '../pages/signup';
import Redirect from '../pages/redirect';


function App() {
  const [token,setToken] = useState(localStorage.getItem("token") );
  const [user, setUser] = useState(token? {id:0, username:'', email:'' }:null);
  const [loggedIn, setLoggedIn] = useState(Boolean(user))

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirect user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} token={token} setToken={setToken} />} />
          <Route path="/redirect" element={<Redirect user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} token={token} setToken={setToken}/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<SignIn setLoggedIn={setLoggedIn} token = {token} setToken={setToken} setUser={setUser}/>} />
          <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/dashboard" element={
            <Protect loggedIn={loggedIn}>
              <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser} token={token} />
            </Protect>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );


}

export default App;
