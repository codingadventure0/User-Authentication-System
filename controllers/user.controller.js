const { userService, borrowerService } = require("../services");
const bcrypt = require("bcrypt");
const { tokenHelper } = require("../helper");
const passwordValidation = require('../middlewares/signup.middleware.js');
const User = require('../model/user.model.js'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');


module.exports = {
    getLoginForm: (req, res) => {
        const message = req.flash('message');
        res.render("form/login", { message });
    },
    getSignUpForm: (req, res) => {
        res.render("form/signup");
    },
    getProfile: async (req, res, next) => {
        const userId = req.userId;
        const user = await userService.findUserById(userId);
        const allPurchasedBooks = await borrowerService.findAllPurchasedBooks(userId, next);
        res.render("pages/profile", { books: allPurchasedBooks, user});
    },
       
    signup: async (req, res, next) => {
        const { name, email, password, batch, registration, role, gender } = req.body;
    
        try {
            const existingUser = await userService.findUserByEmail(email, next);
            if (existingUser) {
                res.locals.message = "User already exists.";
                return res.redirect("/user/signup");
            }
    
            // Generate verification token
            const verificationToken = crypto.randomBytes(20).toString('hex');
            // console.log("Verification token:",verificationToken);
    
            // Save verification token to user
            req.body.verificationToken = verificationToken;
    
            // Create user
            const newUser = await userService.createUser(req.body, next);
    
            // Send verification email
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'miller.rolfson40@ethereal.email',
                    pass: 'jHuJ6FacA6qsmbn2Bc'
                }
            });
    
            const mailOptions = {
                from: 'lms@gmail.com',
                to: email,
                subject: 'Account Verification',
                text: `Hi ${name},\n\nPlease click on the following link to verify your account:\n\n${req.protocol}://${req.get('host')}/user/verify/${verificationToken}`,
                html: `<b>Hi ${name},\n\nPlease click on the following link to verify your account:\n\n${req.protocol}://${req.get('host')}/user/verify/${verificationToken}</b>`,
            };
    
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.error('Error sending verification email:', err);
                    req.flash('error', 'Error sending verification email');
                } else {
                    req.flash('message', 'Account created successfully. Please check your email for verification.');
                }
                return res.redirect("/user/login");
            });
    
        } catch (error) {
            console.error('Error creating user:', error);
            next(error);
        }
    },
    
    verifyEmail: async (req, res, next) => {
        const token = req.params.token;
    
        try {
            const user = await userService.findUserByVerificationToken(token, next);
            if (!user) {
                return res.status(404).send('Invalid or expired verification token');
            }
    
            // Update user verification status
            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();
    
            // Redirect to login page with message
            res.redirect('/user/login?message=Email verified successfully. You can now login.');
        } catch (error) {
            console.error('Error verifying email:', error);
            next(error);
        }
    },    
    login: async (req, res, next) => {
        const { email, password, remember } = req.body;
    
        try {
            // Find user by email
            const user = await userService.findUserByEmail(email, next);
    
            // Check if user exists
            if (!user) {
                return res.render("form/login", { error: "User does not exist with this email." });
            }
            
            // Check if user is verified
            if (!user.isVerified) {
                return res.render("form/login", { error: "Please verify your email before logging in." });
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.render("form/login", { error: "Incorrect password." });
            }
    
           // Generate token with expiration time
           let tokenExpiration = "1h"; // Default expiration time
           if (remember) {
               tokenExpiration = "7d"; // 7 days if remember me
           }
           const userId = user._id;
           const token = await tokenHelper.sign({ userId, role: user.role }, tokenExpiration);
           user.token = token;
           delete user._id;

           // Update user with new token
           await userService.updateUser(user, userId, next);

           // Set token in cookie
           const maxAge = remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 1; // Default to 1 hour if remember is false
           res.cookie("token", token, { httpOnly: true, maxAge });

           // Redirect to profile page
           return res.redirect("/user/profile");
        } catch (error) {
            // Handle other errors
            next(error);
        }
    }, 

    logout: async (req, res, next) => {
        res.cookie("token", "");
        return res.redirect("/user/login");
    },
    updateProfilePictureUrl: async (req, res) => {
        const { newProfilePictureUrl, newName, newBatch, newGender } = req.body; // Include newGender
        try {
            const userId = req.userId; // Assuming you're using JWT authentication
            await User.findByIdAndUpdate(userId, { 
                profilePictureUrl: newProfilePictureUrl,
                name: newName,
                batch: newBatch,
                gender: newGender // Update gender field
            });
            res.sendStatus(200); // Send status OK if successful
        } catch (error) {
            console.error('Error updating profile details:', error);
            res.status(500).send('Error updating profile details'); // Send status 500 for internal server error
        }
    },
    checkOldPassword: async (req, res) => {
        try {
            const { oldPassword } = req.body;
            const userId = req.userId;
            
            // Fetch user by userId
            const user = await User.findById(userId);
            
            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Decrypt and compare stored password with oldPassword
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            
            // Old password is correct
            return res.status(200).json({ message: 'Old password is correct' });
        } catch (error) {
            console.error('Error checking old password:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userId = req.userId;
    
            // Fetch user by userId
            const user = await User.findById(userId);
    
            // Check if user exists
            if (!user) {
                return res.redirect("/user/profile?error=User not found");
            }
    
            // Decrypt and compare stored password with oldPassword
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                // return res.status(400).json({ message: 'Old password is incorrect' });
                return res.redirect("/user/profile?error=Old password is incorrect");
            }
    
            // Validate new password
            if (newPassword !== confirmPassword) {
                // return res.status(400).json({ message: 'New password and confirm password do not match' });
                return res.redirect("/user/profile?error=New password and confirm password do not match");
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Update user's password
            user.password = hashedPassword;
            await user.save();
    
            // Send success response
            // res.status(200).json({ message: 'Password updated successfully' });
            return res.redirect("/user/profile?message=Password updated successfully");
    
        } catch (error) {
            console.error('Error resetting password:', error);
            // res.status(500).json({ message: 'Internal server error' });
            return res.redirect("/user/profile?error=Internal server error");
        }
    },    
    
    deleteAccount: async (req, res,next) => {
        try {
          const { email, password } = req.body;
          const userId = req.userId; // Assuming you have userId available in the request
    
          // Fetch user by userId
          const user = await User.findById(userId);
    
          // Check if user exists
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    
          // Check if the entered password matches the user's password
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
          }
    
          // Delete the user account
          await User.findByIdAndDelete(userId);
    
          // You may want to perform additional cleanup tasks, such as deleting related data
    
          // Send success response
          res.status(200).json({ message: 'Account deleted successfully' });
          
        } catch (error) {
          console.error('Error deleting account:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
        
};
