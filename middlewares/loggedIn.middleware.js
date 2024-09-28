const { tokenHelper } = require("../helper");

module.exports = {
    // Middleware function to check if the user is authenticated and logged in
    loggedIn: async (req, res, next) => {
        // Decode the token from cookies using tokenHelper and pass the result to cookies variable    
        const cookies = await tokenHelper.decode(req.cookies['token'], next);

        // Extract userId and role from the decoded token (if available)
        const userId = cookies?.userId;
        const role = cookies?.role;

        // If no userId is found, set loggedIn to false (user is not authenticated)
        if (!userId) {
            res.locals.loggedIn = false;
        } else {
            res.locals.loggedIn = true;
        }
        
        next();
    }
}