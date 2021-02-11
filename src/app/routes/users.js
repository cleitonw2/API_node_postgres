const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../../app/models');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash)
        const user = await User.create({ name: name, email: email, password: passwordHash });
        res.json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error registering new user please try again.' })
    }
});

module.exports = router;