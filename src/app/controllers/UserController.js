const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('../middlewares/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const moment = require('moment');

class UserController {
    async register(req, res) {
        try {
            let { name, email, password } = req.body;
            const passwordHash = await bcrypt.hash(password, 10);

            const user = await User.create({ name: name, email: email, password: passwordHash });

            const token = jwt.sign({ user: user.id });
            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            res.status(200).json({ user: user, token: token });
        } catch (error) {
            res.status(500).json({ error: 'Error registering new user please try again.' })
        }
    }

    async login(req, res) {
        try {
            let { email, password } = req.body;
            const user = await User.findOne({ where: { email: email } });

            if (!user)
                res.status(500).json('user not found');
            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);

                if (validPassword) {
                    user.password = undefined;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;

                    const token = jwt.sign({ user: user.id });

                    res.status(200).json({ user: user, token: token });

                } else if (!validPassword) {
                    res.status(500).json({ error: 'invalid password' });
                }
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async updateUser(req, res) {
        const { name, email } = req.body;
        const id = req.id;
        try {
            await User.update({ name: name, email: email }, { where: { id: id } });
            res.status(200).json('updated user');
        } catch (error) {
            res.status(500).json({ error: 'error updating the user' });
        }
    }

    async updatePassword(req, res) {
        const { password } = req.body;
        const id = req.id;
        const passwordHash = await bcrypt.hash(password, 10);
        try {
            await User.update({ password: passwordHash }, { where: { id: id } });
            res.status(200).json({ msg: 'Password successfully updated' });
        } catch (error) {
            res.status(500).json({ error: 'not possible to update the password' });
        }
    }

    async deletUser(req, res) {
        const id = req.id;
        try {
            await User.destroy({ where: { id: id } });
            res.status(200).json('user successfully deleted');
        } catch (error) {
            res.status(500).json({ error: 'error when delete user' });
        }
    }

    async forgot_password(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findAll({
                where: {
                    email: email
                }
            });
            
            if (!user)
                return res.status(400).json({ error: 'User not found' });

            const token = crypto.randomBytes(3).toString('hex');

            const now = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm');

            await User.update({
                passwordResetToken: token,
                passwordResetExpires: now,
            }, { where: { email: email } });

            const message =
                ` <p>Você esqueceu sua senha? Utilize este token para redefinir:(${token})</p>`;

            await mailer.sendMail({
                to: email,
                from: 'suportinc@g.com.br',
                template: 'auth/forgot_password',
                subject: 'Redefinir senha',
                html: message,
                text: token
            }, (err) => {
                if (err)
                    return res.status(400).json({ error: 'Not possible send the email!' });
            });

            res.status(200).json('ok');
        } catch (error) {
            return res.status(400).json({ error: 'Error on forgot password, try again' });
        }
    }

    async reset_password(req, res) {
        const { email, token, password } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });

            if (!user)
                return res.status(400).json({ error: 'User not found' });

            if (token !== user.passwordResetToken)
                return res.status(400).json({ error: 'Token invalid' });

            const now = moment().format('YYYY-MM-DD HH:mm');

            if (now > moment(user.passwordResetExpires).format('YYYY-MM-DD HH:mm'))
                return res.status(400).json({ error: 'Token expired, generate a new one' });

            const passwordHash = await bcrypt.hash(password, 10);

            await User.update({
                password: passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null,
            }, { where: { email: email } });

            res.status(200).json('password successfully updated');
        } catch (error) {
            res.status(400).json('it was not possible to update the password!')
        }
    }

}

module.exports = new UserController();