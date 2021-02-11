const express = require('express');
const app = express();

const publicRouter = require('./app/routes/users');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(publicRouter);

app.listen(3000);