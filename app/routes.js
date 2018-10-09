const userController = require('./controllers/user_controller');
const validations = require('./validations');

exports.init = app => {
  app.post('/users', validations.validateSignUp, validations.validationResultHandler, userController.signUp);
  app.post(
    '/users/sessions',
    validations.validateSignIn,
    validations.validationResultHandler,
    userController.signIn
  );
};
