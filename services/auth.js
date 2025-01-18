const jwt = require("jsonwebtoken");
const config = require('../config');

function generateToken(user) {
    return jwt.sign(user, config.secretKey);
}

function verifyToken(req, res, next) {
    const token = req.cookies.token || '';

    jwt.verify(token, config.secretKey , (err, user) =>{
        if(err){
            return res.redirect('/login');
        }

        req.user = user;
        next();
    });
}

function authorize(role){
    return function(req, res, next) {
        if(req.user && req.user.role === role ){
            next();
        }else{
            res.status(403).send('Forbidden');
        }
    };
}

module.exports = {
    generateToken,
    verifyToken,
    authorize
};