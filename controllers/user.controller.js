const { userService, borrowerService } = require("../services");
const bcrypt = require("bcrypt");
const { tokenHelper } = require("../helper");
const passwordValidation = require('../middlewares/signup.middleware.js');

module.exports = {
    getLoginForm: (req, res) => {
        res.render("form/login");
    },
    getSignUpForm: (req, res) => {
        res.render("form/signup");
    },
    getProfile: async (req, res, next) => {
        const userId = req.userId;
        const user = await userService.findUserById(userId);
        const allPurchasedBooks = await borrowerService.findAllPurchasedBooks(userId, next);
        res.render("pages/profile", { books: allPurchasedBooks, user: { name: user.name, batch: user.batch, email: user.email } });
    },
    login: async (req, res, next) => {
        const { email, password } = req.body;
    
        try {
            // Find user by email
            const user = await userService.findUserByEmail(email, next);
    
            // Check if user exists
            if (!user) {
                return res.render("form/login", 
                { 
                   error: "User does not exist with this email." 
                });
            }
    
            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.render("form/login", 
                { 
                    error: "Incorrect password." 
                });
            }
    
            // Generate token
            const userId = user._id;
            const token = await tokenHelper.sign({ userId, role: user.role }, next);
            user.token = token;
            delete user._id;
            
            // Update user with new token
            await userService.updateUser(user, userId, next);
    
            // Set token in cookie
            res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 1 });
    
            // Redirect to profile page
            return res.redirect("/user/profile");
        } catch (error) {
            // Handle other errors
            next(error);
        }
    },
    signup: async (req, res, next) => {
        const {
            email,
            password
        } = req.body;
        const user = await userService.findUserByEmail(email, next);
        if (user) {
            res.locals.message = "User already exists.";
            return res.redirect("/user/signup")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        const newUser = await userService.createUser(req.body, next);
        return res.redirect("/user/login");
    },
    logout: async (req, res, next) => {
        res.cookie("token", "");
        return res.redirect("/user/login");
    }
};
