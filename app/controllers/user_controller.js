const User = require('../models').User,
  logger = require('../logger'),
  error = require('../errors');

exports.signUp = (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      logger.info(`User ${name} created.`);
      res.status(201).json({ user });
      res.end();
    })
    .catch(err => {
      next(error.dataBaseError(err.errors[0].message));
    });
};
