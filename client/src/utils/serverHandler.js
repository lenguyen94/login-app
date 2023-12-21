
const loginUser = async (email, password) => {
  return fetch(global.config.apiServer + "/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({ email, password })
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

const readUsers = async () => {
  return fetch(global.config.apiServer + "/readAll", {
    method: "GET",
    credentials: "include",
  }).then(r => r.json())
}

const updateUser = async (username) => {
  return fetch(global.config.apiServer + "/update", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  }).then(r => r.json())
}

const updatePassword = async (password, passwordOld) => {
  return fetch(global.config.apiServer + "/update-pw", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, passwordOld }),
    credentials: "include",
  }).then(r => r.json())
}


const updateSession = async () => {
  return fetch(global.config.apiServer + "/updateSession", {
    method: "POST",
    credentials: "include"
  }).then(r => r.json())
}

const readUser = async () => {
  return fetch(global.config.apiServer + "/read", {
    method: "GET",
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

const logoutUser = async () => {
  return fetch(global.config.apiServer + "/logout", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include"
  }).then(r => r.json())
}




module.exports = { loginUser, loginUserGG, signupUser, readUser, readUsers, updateUser, updatePassword, updateSession, resendEmail, logoutUser }