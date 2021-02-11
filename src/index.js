const express = require('express');
const app = express();

const { User } = require('./app/models');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', (req, res) => {
    const { name, email, password } = req.body;
    User.create({ name: name, email: email, password: password });
    res.json('usuário cadastrado com sucesso');
});

app.listen(3000);