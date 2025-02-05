const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();


router.get('/users', userController.getUsers)
router.get('/user/:userId', userController.getUserbyId)
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;