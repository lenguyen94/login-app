
const loginUser = async (email, password) => {
  return fetch(global.config.apiServer + "/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({ email, password })
    // body: JSON.stringify({ 
    //   email:"tester1@email.com",
    //    password: "tester1" })
  }).then(r => r.json())
}

const loginUserGG = async () => {
  return fetch(global.config.apiServer + "/login-google", {
    method: "GET", redirect: 'follow',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include"
  }).then(r => r.json())
}


const signupUser = async (username, email, password) => {
  return fetch(global.config.apiServer + "/register", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({ username, email, password })
  }).then(r => r.json())
}

const readUsers = async (token) => {
  return fetch(global.config.apiServer + "/readAll", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    credentials: "include",
  }).then(r => r.json())
}

const updateUser = async (token,username) => {
  return fetch(global.config.apiServer + "/update", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  }).then(r => r.json())
}

const updatePassword = async (token, password, passwordOld) => {
  return fetch(global.config.apiServer + "/update-pw", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    body: JSON.stringify({ password, passwordOld }),
    credentials: "include",
  }).then(r => r.json())
}


const updateSession = async (token) => {
  return fetch(global.config.apiServer + "/updateSession", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    credentials: "include"
  }).then(r => r.json())
}

const readUser = async (token) => {
  return fetch(global.config.apiServer + "/read", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    credentials: "include"
  }).then(r => r.json())
}

const resendEmail = async (email) => {
  var a = JSON.stringify({ email })
  console.log(email, a)
  return fetch(global.config.apiServer + "/resend-email", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({ email })
  }).then(r => r.json())
}

const logoutUser = async (token) => {
  return fetch(global.config.apiServer + "/logout", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    credentials: "include"
  }).then(r => r.json())
}


export {
  loginUser, loginUserGG, signupUser, readUser, readUsers, updateUser, updatePassword, updateSession, resendEmail, logoutUser
}
