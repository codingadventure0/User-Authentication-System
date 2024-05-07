const authMiddleware = require("./auth.middleware");
const authrorizationMiddleware  = require("./authorization.middlware");
const loggedInMiddleware = require("./loggedIn.middleware");
const passwordValidation = require("./signup.middleware");

module.exports = {
    authMiddleware,
    authrorizationMiddleware,
    passwordValidation,
    loggedInMiddleware
}
