const User = require('../models').User,
  logger = require('../logger'),
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
