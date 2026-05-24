const jwt = require("jsonwebtoken")
const envObj = require("../config/env");
const createToken = (user) => {
    const payload = {
        "username": user.username,
        "email": user.email,
        "id": user._id,
        "role": user.role

    }
    const token = jwt.sign(payload, envObj.SECRET_KEY, {expiresIn: "1d"})
    return token;   
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        });
    }
  
    try {
        const decoded = jwt.verify(
            token,
            envObj.SECRET_KEY
        );

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};
module.exports = {
    createToken,
    verifyToken
}
