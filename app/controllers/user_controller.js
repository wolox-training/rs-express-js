const User = require('../models').User,
  logger = require('../logger');

exports.signUp = (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      logger.info(`User ${name} created.`);
      res.status(201).json({ user });
      res.end();
    })
    .catch(next);
};
