const authMiddleware = require("./auth.middleware");
const loggedInMiddleware = require("./loggedIn.middleware");
const passwordValidation = require("./signup.middleware");

module.exports = {
    authMiddleware,
    passwordValidation,
    loggedInMiddleware
}
