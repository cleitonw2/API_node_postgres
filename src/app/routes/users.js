const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../../app/models');
const jwt = require('../middlewares/auth');

router.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({ name: name, email: email, password: passwordHash });

        const token = jwt.sign({ user: user.id });
        user.password = undefined;
        res.status(200).json({ user: user, token: token });
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user please try again.' })
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user)
            res.status(500).json('user not found');
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                user.password = undefined;
                const token = jwt.sign({ user: user.id });
                res.status(200).json({ user: user, token: token });
            } else {
                res.status(500).json({ error: 'invalid password' });
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.put('/', jwt.verify, async (req, res) => {
    const { name, email } = req.body;
    const id = req.id;
    try {
        await User.update({ name: name, email: email }, { where: { id: id } });
        res.status(200).json('updated user');
    } catch (error) {
        res.status(500).json({ error: 'error updating the user' });
    }
});

router.patch('/password', jwt.verify, async (req, res) => {
    const { password } = req.body;
    const id = req.id;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        await User.update({ password: passwordHash }, { where: { id: id } });
        res.status(200).json({ msg: 'Password successfully updated' });
    } catch (error) {
        res.status(500).json({ error: 'not possible to update the password' });
    }
});

module.exports = router;