const tokenMiddleware = require('../middleware/TokenMiddleware');
const userController = require('../controllers/UserController');
const router = require('express').Router();
//get all user    
router.get('/', tokenMiddleware.verifyToken, userController.getAllUser)

//delete user
router.delete('/:id', tokenMiddleware.verifyTokenAndAdminAuth, userController.deleteUser)
module.exports = router; 