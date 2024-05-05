const { userService, borrowerService } = require("../services");
const bcrypt = require("bcrypt");
const { tokenHelper } = require("../helper");
const passwordValidation = require('../middlewares/signup.middleware.js');
const User = require('../model/user.model.js'); 

module.exports = {
    getLoginForm: (req, res) => {
        res.render("form/login");
    },
    getSignUpForm: (req, res) => {
        res.render("form/signup");
    },
    getProfile: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await userService.findUserById(userId);
            const allPurchasedBooks = await borrowerService.findAllPurchasedBooks(userId, next);
            
            // Pass flash messages along with other data
            res.render("pages/profile", { books: allPurchasedBooks, user, messages: req.flash() });
        } catch (error) {
            // Handle errors
            next(error);
        }
    },
    
    // uploadProfilePicture: async (req, res, next) => {
    //     try {
    //         const userId = req.userId;
    //         const user = await userService.findUserById(userId);
            
    //         // Check if file is uploaded
    //         if (!req.file) {
    //             return res.status(400).json({ error: "No file uploaded." });
    //         }

    //         // Save file path to user's profilePictureUrl field in the database
    //         user.profilePictureUrl = path.join(__dirname, "..", req.file.path); // Assuming multer saves file to a "uploads" directory
    //         await userService.updateUser(user, userId, next);

    //         // Redirect back to profile page
    //         res.redirect("/user/profile");
    //     } catch (error) {
    //         // Handle error
    //         next(error);
    //     }
    // },  
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
                req.flash("error", "Incorrect password.");
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
        try {
            const {
                email,
                password
            } = req.body;
            const user = await userService.findUserByEmail(email, next);
            if (user) {
                req.flash("error", "User already exists.");
                res.locals.message = "User already exists.";
                return res.redirect("/user/signup")
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;
            const newUser = await userService.createUser(req.body, next);
            return res.redirect("/user/login");
        } catch (error) {
            // Handle errors
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
            req.flash("success", "Account Update Successfully");
            // res.sendStatus(200); // Send status OK if successful
            return res.redirect("/user/profile");

        } catch (error) {
            console.error('Error updating profile details:', error);
            req.flash("error", "Failed to update account details.");
            // res.status(500).send('Error updating profile details'); // Send status 500 for internal server error
            return res.redirect("/user/profile");
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
                req.flash("error", "User not found");
                return res.redirect("/user/profile?error=User not found");
            }
    
            // Decrypt and compare stored password with oldPassword
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                // return res.status(400).json({ message: 'Old password is incorrect' });
                req.flash("error", "Old password is incorrect");
                return res.redirect("/user/profile");
            }
    
            // Validate new password
            if (newPassword !== confirmPassword) {
                // return res.status(400).json({ message: 'New password and confirm password do not match' });
                req.flash("error", "New password and confirm password do not match");
                return res.redirect("/user/profile");
            
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Update user's password
            user.password = hashedPassword;
            await user.save();
    
            // Send success response
            // res.status(200).json({ message: 'Password updated successfully' });
            // return res.redirect("/user/profile?message=Password updated successfully");
            req.flash("success", "Password updated successfully.");
            return res.redirect("/user/profile");

        } catch (error) {
            console.error('Error resetting password:', error);
            // res.status(500).json({ message: 'Internal server error' });
            req.flash("error", "Failed to update password.");
            return res.redirect("/user/profile");
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
            req.flash("error", "User not found");
            // return res.status(404).json({ message: 'User not found' });
            return res.redirect("/user/profile");
          }
    
          // Check if the entered password matches the user's password
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            req.flash("error", "Incorrect password");
            // return res.status(400).json({ message: 'Incorrect password' });
            return res.redirect("/user/profile");
          }
    
          // Delete the user account
          await User.findByIdAndDelete(userId);
    
          // You may want to perform additional cleanup tasks, such as deleting related data
    
          // Send success response
          req.flash("success", "Account deleted successfully.");
        //   res.status(200).json({ message: 'Account deleted successfully' });
          return res.redirect("/user/login");

        } catch (error) {
          console.error('Error deleting account:', error);
        //   res.status(500).json({ message: 'Internal server error' });
          req.flash("error", "Failed to delete account.");
          return res.redirect("/user/profile");
        }
      }
        
};
