const express = require('express');
const app = express();

const router = require('./app/routes/users');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(3000);