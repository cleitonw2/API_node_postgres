const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT;

const sign = payload => jwt.sign(payload, secret, { expiresIn: '10d'});
const verify = token => jwt.verify(token, secret);

module.exports = { sign, verify };
