const userController = require('./controllers/user_controller');
const User = require('./models').User;
const { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post(
    '/users',
    check('email').matches(
      /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(com|co|com\.ar)$/
    ),
    check('email').custom(value => {
      return User.findOne({ where: { email: value } }).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    check('password')
      .isLength({ min: 8 })
      .matches(/^[a-zA-Z0-9]*$/),
    function(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        next();
      }
    },
    userController.signup
    // app.put('/endpoint/put/path', [], controller.methodPUT);
    // app.post('/endpoint/post/path', [], controller.methodPOST);
  );
};
