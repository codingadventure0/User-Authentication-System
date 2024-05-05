var express = require('express');
var router = express.Router();
const { userController } = require("../controllers/");
const { authMiddleware, loggedInMiddleware } = require("../middlewares");
const passwordValidation = require('../middlewares/signup.middleware.js');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use original filename
    }
});
const upload = multer({ storage: storage });

// POST route for uploading profile picture
// router.post("/profile-picture", upload.single("profilePicture"), userController.uploadProfilePicture);


/* GET home page. */
router.get('/login', loggedInMiddleware.loggedIn, userController.getLoginForm);
router.get('/signup', loggedInMiddleware.loggedIn, userController.getSignUpForm);
router.get('/profile', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.getProfile);

router.post('/login', loggedInMiddleware.loggedIn, userController.login);
router.post('/signup', passwordValidation, userController.signup);
router.get('/logout', loggedInMiddleware.loggedIn, userController.logout);
// New route for updating profile picture URL
router.post('/updateProfilePictureUrl', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.updateProfilePictureUrl);

// Define the route for resetting password
router.post('/resetPassword',loggedInMiddleware.loggedIn, authMiddleware.auth, userController.resetPassword);

// Define a route for flashing messages
router.get('/flash', (req, res) => {
    req.flash('success', 'This is a flash message!');
    res.redirect('/profile');
});

// Delete user account route
router.post('/destroy',loggedInMiddleware.loggedIn, authMiddleware.auth, userController.deleteAccount);

module.exports = router;
