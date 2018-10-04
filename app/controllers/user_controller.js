const User = require('../models').User,
  logger = require('../logger');

exports.signup = function(req, res) {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      logger.info(`User ${name} created.`);
      res.status(201).json({ user });
      res.end();
    })
    .catch(error => {
      logger.error(error);
      res.statusMessage = error;
      res.status(500).json({ error });
      res.end();
    });
};
