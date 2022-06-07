const router = require('express').Router();
const authController = require('../controllers/AuthController');
const tokenMiddleware = require('../middleware/TokenMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.requestRefreshToken)
router.post('/logout',tokenMiddleware.verifyToken, authController.logout)

module.exports = router;