//importing modules
const express = require('express')
const passport = require('passport');
const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth')

const router = express.Router()


// login related
router.post('/login', userController.login)

router.get('/login-google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login-google/callback', userController.loginGoogle);

router.post('/logout', userAuth.verifyToken, userController.logout);

// email
router.get('/verify-email/:id/:token', userController.verifyEmail)

router.post('/resend-email', userController.resendEmail)

// CRUD
router.post('/register', userAuth.verifyNewUser, userAuth.verifyPassword, userController.signup)

router.get('/read', userAuth.verifyToken, userController.getUser)

router.get('/readAll', userAuth.verifyToken, userController.getAllUsers)

router.post('/update', userAuth.verifyToken, userController.updateUser)

router.post('/update-pw', userAuth.verifyToken, userAuth.verifyPassword, userController.updateUser)

router.post('/updateSession', userAuth.verifyToken, userController.updateSession)

// misc
router.post('/verify-token', userAuth.verifyToken, userAuth.checkAuthenticated, (req, res) => res.end())


module.exports = router