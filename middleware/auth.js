const jwt = require("jsonwebtoken");
// const User = require("../models/users");
require("dotenv").config();
const verifyToken = (req, res,next) => {
    let token = req.headers['jwtoken'];
    if (token == null) return res.sendStatus(401)
    const user = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = user;
        next();
};
module.exports = verifyToken;