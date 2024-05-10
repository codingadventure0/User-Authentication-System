var express = require('express');
var router = express.Router();
const { userController } = require("../controllers/");
const { authMiddleware, loggedInMiddleware } = require("../middlewares");
const passwordValidation = require('../middlewares/signup.middleware.js');
const UserController =require("../controllers/user.controller.js")

/* GET home page. */
router.get('/login', loggedInMiddleware.loggedIn, userController.getLoginForm);
router.get('/signup', loggedInMiddleware.loggedIn, userController.getSignUpForm);
router.get('/profile', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.getProfile);

router.post('/login', loggedInMiddleware.loggedIn, userController.login);
router.post('/signup', passwordValidation, userController.signup);
router.get('/logout', loggedInMiddleware.loggedIn, userController.logout);
// New route for updating profile picture URL
router.post('/updateProfilePictureUrl', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.updateProfilePictureUrl);

// Define the route for checking for old password
router.post('/checkPwd',loggedInMiddleware.loggedIn, authMiddleware.auth,  UserController.checkOldPassword);

// Define the route for resetting password
router.post('/resetPassword',loggedInMiddleware.loggedIn, authMiddleware.auth, userController.resetPassword);

// Delete user account route
router.post('/destroy',loggedInMiddleware.loggedIn, authMiddleware.auth, userController.deleteAccount);

// Define the route for verification of email
router.get('/verify/:token', userController.verifyEmail);

module.exports = router;
