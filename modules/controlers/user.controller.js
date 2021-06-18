/* eslint-disable class-methods-use-this */
const { validationResult } = require('express-validator');
const userService = require('../services/user.servise');
const ApiError = require('../helpers/ApiError');

class UsersController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Validation failure', errors.array());
      }
      const { login, password } = req.body;
      const userData = await userService.registration(login, password);
      res.send(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const userData = await userService.login(login, password);
      res.send(userData);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
