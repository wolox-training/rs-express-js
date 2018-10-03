const userController = require('./controllers/user_controller');
const User = require('./models').User;
const { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post(
    '/users',
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
      .withMessage('E-mail must be from wolox domain')
      .custom(value => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
    check('password')
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password should be 8 characters minimum')
      .matches(/^[a-zA-Z0-9]*$/)
      .withMessage('Password should be alphanumeric only'),
    function(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        next();
      }
    },
    userController.signup
  );
};
