const db = require("../models");
const jwt = require("jsonwebtoken");
const passwordValidator = require('password-validator');


const User = db.users;
var schema = new passwordValidator()
  // .is().min(1)
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

const verifyNewUser = async (req, res, next) => {
  try {
    const { username, email } = req.body

    if (!(username && email)) { throw new Error('Missing email / username') }

    const emailcheck = await User.findOne({
      where: { email: req.body.email }
    });
    if (emailcheck) { throw new Error('Email taken') }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.toString() });
  }
};

const verifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body

    if (!password) { throw new Error('Missing Password') }
    if (!schema.validate(password)) { throw new Error('Weak password') };
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.toString() });
  }
}

const verifyToken = (req, res, next) => {
  try {

    if (!req.cookies) { throw new Error('No cookies') }

    const token = req.cookies['jwt-token']
    if (!token) { throw new Error('No JWT Token detected') }

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.toString() });
  }
}

// for passportjs, but unused
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(400).json('Invalid session id');
  }
  next();
}

// for passportjs, but unused
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(400).json('Valid session id');
}



module.exports = { verifyNewUser, verifyToken, verifyPassword, checkAuthenticated, checkNotAuthenticated };
