require("dotenv").config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRETKEY;

const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        res.status(401).json("Try to authenticate using valid token");
    }
    try {
        const decode = jwt.verify(token, secret);
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json("Try to authenticate using valid token");
    }
}




module.exports = fetchUser;