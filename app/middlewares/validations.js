const { check, validationResult } = require('express-validator/check'),
  User = require('../models').User,
  error = require('../errors');

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
