const User = require('../models').User,
  bcrypt = require('bcrypt'),
  logger = require('../logger'),
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  error = require('../errors');

exports.signUp = function(req, res) {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      logger.info(`User ${name} created.`);
      res
        .status(201)
        .json({ user })
        .end();
    })
    .catch(err => {
      logger.error(err);
      throw error.dataBaseError(err);
    });
};

exports.signIn = function(req, res, next) {
  const { email, password } = req.body;
  return User.findOne({ where: { email } }).then(user => {
    if (!user) next(error.unAuthorizedError('Invalid credentials'));
    if (!user.validatePassword(password)) next(error.unAuthorizedError('Invalid credentials'));
    if (user && user.validatePassword(password)) {
      const token = jwt.sign({ id: user._id }, config.common.session.secret);
      res.status(200).send({ auth: true, token });
    }
  });
};
