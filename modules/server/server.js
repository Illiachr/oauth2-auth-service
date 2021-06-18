require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('../routers/users.router');
const errorMiddleware = require('../middlewares/error.middleware');
const userModel = require('../models/user.model');

const PORT = process.env.PORT || 5000;
const server = express();
server.use(morgan('common'));
server.use(express.json());
server.use(cors());
server.use('/api/v1', usersRouter);
server.use(errorMiddleware);

exports.start = async () => {
  try {
    await userModel.connectCloud(process.env.DATABASE_URL);
    server.listen(PORT, () => console.warn(`Server started on PORT: ${PORT}`));
  } catch (err) {
    console.warn(err);
  }
};
