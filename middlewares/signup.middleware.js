const { userService } = require("../services");
const bcrypt = require("bcrypt");

const passwordValidation = async (req, res, next) => {
    const {
        name,
        email,
        password,
        confpassword,
        batch,
        registration,
        role,
        gender
    } = req.body;

    // Check if passwords match
    if (password !== confpassword) {
        req.flash('error', "Passwords don't match");
        return res.redirect("/user/signup");
    }

    // Check password complexity
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    if (!regex.test(password)) {
        req.flash('error', "Password must contain at least one uppercase letter, one special symbol, and one number");
        return res.redirect("/user/signup");
    }

    // Continue with user creation logic
    try {
        const userExists = await userService.findUserByEmail(email, next);
        if (userExists) {
            // Send flash message and render the signup form with the error
            req.flash('error', 'Email is already in use. Please choose a different email.');
            return res.render('form/signup', { error: req.flash('error'), name, email, batch, registration, role, gender });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userService.createUser({
            name,
            email,
            password: hashedPassword,
            batch,
            registration,
            role,
            gender
        }, next);

        return res.redirect("/user/login");
    } catch (error) {
        // Handle other errors
        next(error);
    }
}

module.exports = passwordValidation;