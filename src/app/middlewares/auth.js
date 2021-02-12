const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT;

const sign = payload => jwt.sign(payload, secret, { expiresIn: '10d' });

const verify = (req, res, next) => {
    const token = req.headers['access-token'];
    if (!token)
        res.status(401).json({ error: 'Unauthorized: no token provided' });
    jwt.verify(token, secret, (error, decoded) => {
        if (error)
        res.status(401).json({ error: 'Unauthorized: token invalid' });
        else 
           req.id = decoded.user;
    });
    next();
}

module.exports = { sign, verify };