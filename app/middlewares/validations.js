const { check, validationResult } = require('express-validator/check'),
  User = require('../models').User,
  error = require('../errors'),
  jwt = require('jsonwebtoken'),
  config = require('../../config');

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) next(error.unAuthorizedError('Unauthorized access'));
      req.decoded = decoded;
      next();
    });
  } else {
    next(error.validationError('No token provided'));
  }
};

exports.signUp = [
  check('name')
    .exists()
    .withMessage('Name is required'),
  check('lastname')
    .exists()
    .withMessage('Lastname is required'),
  check('email')
    .exists()
    .withMessage('E-mail is required')
    .matches(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(com|co|com\.ar)$/)
    .withMessage('E-mail must be from wolox domain'),
  check('password')
    .exists()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password should be 8 characters minimum')
    .matches(/^[a-zA-Z0-9]*$/)
    .withMessage('Password should be alphanumeric only')
];

exports.signIn = [
  check('email')
    .exists()
    .withMessage('E-mail is required')
    .matches(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(com|co|com\.ar)$/)
    .withMessage('E-mail must be from wolox domain'),
  check('password')
    .exists()
    .withMessage('Password is required')
];

exports.validationResultHandler = checkArray => {
  checkArray.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(error.validationError(errors.array()));
    } else {
      next();
    }
  });
  return checkArray;
};
