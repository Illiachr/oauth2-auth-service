/* eslint-disable class-methods-use-this */
const userModel = require('../models/user.model');
const UserDto = require('../dtos/user.dto');
const PCrypt = require('../helpers/PCrypt');
const ApiError = require('../helpers/ApiError');

class UserService {
  async registration(login, password) {
    const candidate = await userModel.findOne('login', login);

    if (candidate) {
      throw ApiError.BadRequest(`User with ${login} already exists`);
    }
    const { hash, salt } = PCrypt.setHash(password);
    const userData = await userModel.create(login, hash, salt);
    const user = await this.getUserById(userData.id);
    const userDto = new UserDto(user); // { id, login, role }
    return userDto;
  }

  async login(login, password) {
    const user = await userModel.findOne({ login });
    if (!user) {
      throw ApiError.NotFound(`User with login: ${login} not found`);
    }

    const isPassEquals = await PCrypt.compare(password, user.hash, user.salt);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password not accepted');
    }
    const userDto = new UserDto(user);

    return userDto;
  }

  async getUserById(id) {
    const userData = await userModel.findOne('id', id);
    if (!userData) {
      throw ApiError.NotFound(`User with UID: ${id} not found`);
    }
    return userData;
  }

  async getAllUsers() {
    const users = await userModel.getAll();
    return users;
  }
}

module.exports = new UserService();
