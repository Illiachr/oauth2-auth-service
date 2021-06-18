const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controlers/user.controller');

const router = new Router();

router.post('/registration',
  body('login').isLength({ min: 3, max: 20 }),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration);
router.post('/login', userController.login);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

module.exports = router;
