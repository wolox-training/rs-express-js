const User = require('../models').User;
const bcrypt = require('bcrypt');
const logger = require('../logger');

const saltRounds = 10;

exports.signup = function(req, res) {
  const { name, lastname, email, password } = req.body;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    User.create({ name, lastname, email, password: hash })
      .then(user => {
        logger.info(`User ${name} created.`);
        res.status(200).json({ user });
        res.end();
      })
      .catch(error => {
        logger.error(error);
        res.statusMessage = error;
        res.status(500).json({ error });
        res.end();
      });
  });
};
