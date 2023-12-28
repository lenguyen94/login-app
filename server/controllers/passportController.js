
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");

const db = require("../models");
const User = db.users;
const Stats = db.stats;

const userCtrl = require('./userController')

function initialize(passport) {

  const _loginLocal = async (email, password, done) => {
    try {
      var user = await User.findOne({ where: { email: email } });
      if (!user) { throw new Error('No user with that email address') }

      const isSame = await bcrypt.compare(password, user.password);
      if (isSame == false) { throw new Error('Invalid password') }

      const isVerified = user.isVerified;
      if (isVerified == false) { throw new Error('Un-verified User') }

      user = user.dataValues;

      return done(null, user);
    } catch (error) {
      console.log(1)
      return done(error, null);
    }
  };

  const _loginGoogle = async function (accessToken, refreshToken, profile, done) {
    try {
      var user = await User.findOne({ where: { email: profile.emails[0].value } });;
      if (!user) {
        const data = {
          username: profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
        };
        var user = await User.create(data);
        var stats = await Stats.create({ userId: user.id })
        console.log(stats.dataValues);
      }
      user = user.dataValues;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" }, _loginLocal,
    )
  );

  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/api/users/login-google/callback",
      scope: ['profile']
    }, _loginGoogle
    )
  );

  passport.serializeUser((user, cb) => {
    process.nextTick(function () {
      console.log('serial');
      cb(null, user.id)
    })
  });

  passport.deserializeUser((user, cb) => {
    process.nextTick(function () {
      console.log('deserial');
      return cb(null, user);
    });
  });

}

module.exports = initialize;

