const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
require('dotenv').config()

module.exports.createAccessToken = (authenticatedUser) => {
    const data = {
        id: authenticatedUser._id,
        email: authenticatedUser.email,
        isAdmin: authenticatedUser.isAdmin
    }
    return jwt.sign(data, secret, {})
}

module.exports.verifyToken = (req, res, next) => {
    let accessToken = req.headers.authorization;
    if(accessToken){
        accessToken = accessToken.slice(7)
        jwt.verify(accessToken, secret, (err, decoded) =>{
            if(err){
                res.send(false);
            } else {
                req.decodedUser = decoded;
                next();
            }
        })
    } else {
        console.log('accessToken');
        res.send(false);
    }
};

module.exports.verifyIsAdmin = (req, res, next) => {
    if(req.decodedUser.isAdmin){
        next()
    } else {
        res.send(false)
    }
}
