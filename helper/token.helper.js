const jwt = require("jsonwebtoken");

module.exports = {
    sign: async (body, expiresIn) => {
        return await jwt.sign(body, process.env.TOKEN_SECRET, { expiresIn });
    },
    decode: async (token) => {
        return await jwt.decode(token, process.env.TOKEN_SECRET);
    }
}
