const router = require('express').Router();
const auth = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot_password', UserController.forgot_password);
router.post('/reset_password', UserController.reset_password);

router.use(auth.verify);

router.put('/', UserController.updateUser);
router.patch('/password', UserController.updatePassword);
router.delete('/', UserController.deletUser);

module.exports = router;