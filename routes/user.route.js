var express = require('express');
var router = express.Router();
const { userController } = require("../controllers");
const { authMiddleware, loggedInMiddleware } = require("../middlewares");
const passwordValidation = require('../middlewares/signup.middleware.js');


/* GET home page. */
router.get('/login', loggedInMiddleware.loggedIn, userController.getLoginForm);
router.get('/signup', loggedInMiddleware.loggedIn, userController.getSignUpForm);
router.get('/profile', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.getProfile);


router.post('/login', loggedInMiddleware.loggedIn, userController.login);
router.post('/signup', passwordValidation, userController.signup);
router.get('/logout', loggedInMiddleware.loggedIn, userController.logout);

module.exports = router;
