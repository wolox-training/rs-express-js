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

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ where: { email } }).then(user => {
    if (!user || !user.validatePassword(password)) next(error.unAuthorizedError('Invalid credentials'));
    if (user && user.validatePassword(password)) {
      const token = jwt.sign({ id: user.email }, config.common.session.secret);
      res
        .status(200)
        .cookie('x-access-token', token)
        .send({ auth: true });
    }
  });
};

exports.createAdminUser = (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      user
        .update({
          isAdmin: true
        })
        .then(() => {
          res
            .status(201)
            .json({ user })
            .end();
        })
        .catch(err => {
          next(error.dataBaseError('Internal server error'));
        });
    } else {
      User.create({ name, lastname, email, password, isAdmin: true })
        .then(createdUser => {
          res
            .status(201)
            .json({ createdUser })
            .end();
        })
        .catch(err => {
          next(error.dataBaseError('Internal server error'));
        });
    }
  });
};

exports.getAllUsers = (req, res, next) => {
  const limit = 5;
  let offset = 0;
  const page = req.query.page || 1;
  User.findAndCountAll()
    .then(data => {
      const pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      User.findAll({
        limit,
        offset
      })
        .then(users => res.status(200).json({ users, count: data.count, pages }))
        .catch(err => next(error.dataBaseError('Error in query to find all users')));
    })
    .catch(err => next(error.dataBaseError('Error in query to find and count all users')));
};
