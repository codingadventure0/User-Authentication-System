const authMiddleware = require("./auth.middleware");
const authrorizationMiddleware  = require("./authorization.middlware");
const loggedInMiddleware = require("./loggedIn.middleware");
const signupMiddleware = require("./signup.middleware");

module.exports = {
    authMiddleware,
    authrorizationMiddleware,
    signupMiddleware,
    loggedInMiddleware
}
