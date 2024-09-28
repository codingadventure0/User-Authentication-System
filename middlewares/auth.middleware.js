const { tokenHelper } = require("../helper");

module.exports = {
    // Middleware function for authentication
    auth: async (req, res, next) => {
        // Decode the token from cookies using tokenHelper and pass the result to cookies variable
        const cookies = await tokenHelper.decode(req.cookies['token'], next);
        // Extract userId and role from the decoded token (if available)
        const userId = cookies?.userId;
        const role = cookies?.role;
        // If no userId is found, it means the user is not authenticated
        if (!userId) {
            res.locals.message = "Please login to continue.";
            return res.redirect("/user/login");
        }
        // console.log("userId", userId)
        // Attach userId and role to the req object for further use in the request lifecycle
        req.userId = userId;
        req.role = role;
        next();
    }
}
