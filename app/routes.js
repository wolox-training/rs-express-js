const userController = require('./controllers/user_controller');
const validate = require('./validations');

exports.init = app => {
  app.get('/users', validate.isAuthenticated, userController.getAllUsers);
  app.post('/users', validate.validationResultHandler(validate.signUp), userController.signUp);
  app.post('/users/sessions', validate.validationResultHandler(validate.signIn), userController.signIn);
};
