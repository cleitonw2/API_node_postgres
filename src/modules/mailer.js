const nodemailer = require('nodemailer');;
require('dotenv').config();

const user = process.env.USER_MAIL;
const host = process.env.HOST_MAIL;
const pass = process.env.PASS_MAIL;
const port = process.env.PORT_MAIL;

const transport = nodemailer.createTransport({
  host: host,
  port: port,
  auth: { user: user, pass: pass },
});

module.exports = transport;