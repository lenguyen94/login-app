const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendingMail } = require("../nodemailer/mailing");
const passport = require('passport');
const sequelize = require('sequelize')


const User = db.users;
const Token = db.tokens;
const Stats = db.stats;


const signup = async (req, res) => {
  try {
    const { username, email, password, isVerified } = req.body;

    const data = {
      username, email, isVerified,
      password: await bcrypt.hash(password, 10),
    }
    const user = await User.create(data);
    if (!user) { throw new Error("Details are not correct.JSON({MESSAGE:") }

    const stats = await Stats.create({ userId: user.id })
    if (!stats) { throw new Error("Server Error") }

    // create verification token and send it via email
    var token = await Token.create({
      userId: user.id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    _createEmail(user, token);

    return res.status(201).json(user);

  } catch (error) {
    console.log(error);
    return res.status(409).json({ error: error.toString() });
  }
}

const login = async (req, res, next) => {
  passport.authenticate('local', function (error, user) {
    try {
      if (error) { throw error }
      else {
        if (!user) { throw new Error("Invalid user") }
        // passportjs protocol
        req.logIn(user, function (error) { if (error) throw error });
        // own protocol, increase login count + create jwt token
        Stats.increment('loginCount', { by: 1, where: { userId: user.id } });
        _createToken(user, res, '30d');
        _updateSession(user.id)

        return res.status(200).json(user);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.toString() });
    }
  })(req, res);
}

const loginGoogle = async (req, res) => {
  passport.authenticate('google', function (error, user) {
    try {
      if (error) { throw error }
      // passportjs protocol
      req.logIn(user, function (error) { if (error) throw error });
      // own protocol, increase login count + create jwt token
      Stats.increment('loginCount', { by: 1, where: { userId: user.id } });
      _createToken(user, res, '30d');
      _updateSession(user.id);

      return res.redirect(`${process.env.CLIENT_URL}`);
      // return res.json({ user });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.toString() });
    }
  })(req, res);
}

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const getAllUsers = async (req, res) => {
  try {
    console.log(1);
    results = await User.findAll({
      attributes: {
        include: ['id', 'username',
          [sequelize.literal('"stat"."loginCount"'), 'loginCount'],
          [sequelize.literal('"stat"."signUpTimestamp"'), 'signUpTimestamp'],
          [sequelize.literal('"stat"."sessionTimestamp"'), 'sessionTimestamp']
        ],
        exclude: ['email', 'password', 'isVerified', 'createdAt', 'updatedAt']
      },
      include: [{
        model: Stats,
        required: true,
        attributes: []
      }],
      raw: true
    })

    res.status(200).json({ users: results });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;

    const { username, email, password, passwordOld } = req.body;

    // if the password field needs to be edited, check for the old password 1st
    if (password) {
      var user = await User.findByPk(userId);
      // for google user w/o password, skip this part
      if (user.password) {
        console.log(1, passwordOld, user.password)
        const isSame = await bcrypt.compare(passwordOld, user.password);
        if (!isSame) { throw new Error("Wrong password") }
      }
    }

    await User.update({
      username, email,
      password: password ? await bcrypt.hash(password, 10) : null
    }, { where: { id: userId }, omitNull: true });

    var user = await User.findByPk(userId);

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const updateSession = async (req, res) => {
  try {
    updated = _updateSession(req.userId)
    if (!updated) { throw new Error("Server error") }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.toString() })
  }
}

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    // expiry route
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) { throw new Error("User deleted. Please re-register.") }
    const usertoken = await Token.findOne({ token, where: { userId: req.params.id, }, });
    if (!usertoken) { throw new Error("Token deleted. Please re-verify.") }

    if (user.isVerified) { throw new Error("Already verified.") }

    const updated = await User.update({ isVerified: true }, { where: { id: usertoken.userId, } });
    if (!updated) { throw new Error("Server error") }

    return res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) { throw new Error("No user with that email.") }
    if (user.isVerified) { throw new Error("User already verified.") }
    let token = await Token.findOne({ where: { userId: user.id }, });
    if (!token) {
      token = await Token.create({
        userId: user.id,
        token: crypto.randomBytes(16).toString("hex"),
      });
    }
    if (!token) { throw new Error("token not created.") }

    const link = _createEmail(user, token);
    return res.status(200).json({ link });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const logout = async (req, res) => {
  try {
    // passport route
    req.logout(function (error) {
      if (error) { throw error }
    });
    // own protocol, update session logout time + jwt token
    _updateSession(req.userId)
    _createToken(req.userId, res, '1s')
    res.status(200).json({ message: 'success' })
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ error: error.toString() });
  }
}

const _updateSession = async (userId) => {
  return Stats.update(
    { sessionTimestamp: new Date() },
    { where: { userId } }
  );
}

const _createToken = (user, res, duration) => {
  let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, {
    expiresIn: duration,
  });

  res.cookie("jwt-token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
    httpOnly: true,
  });

  return token
}

const _createEmail = async (user, token) => {
  const link = `http://${process.env.HOST}:${process.env.PORT}/api/users/verify-email/${user.id}/${token.token} `;

  sendingMail({
    from: "no-reply@example.com",
    to: `${user.email}`,
    subject: "Account Verification Link",
    text: `Hello, ${user.username}, 
Please verify your email by clicking this link :
${link} `,
  });
  return link
}


//exporting the modules
module.exports = { signup, login, loginGoogle, getUser, getAllUsers, updateUser, updateSession, verifyEmail, resendEmail, logout };
