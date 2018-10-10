const User = require('../models').User,
  bcrypt = require('bcrypt'),
  logger = require('../logger'),
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  error = require('../errors');

exports.signUp = (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      res
        .status(201)
        .json({ user })
        .end();
    })
    .catch(err => {
      next(error.dataBaseError(err.errors[0].message));
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

exports.getAllUsers = function(req, res, next) {
  User.findAll().then(users => {
    res
      .status(200)
      .json({ users })
      .end();
  });
};
