const app = require('./App');
require('dotenv').config();


app.listen(process.env.SERVER_PORT);