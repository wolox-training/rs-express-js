const userController = require('./controllers/user_controller');
const { signUp, validationResultHandler, signIn, isAuthenticated } = require('./middlewares/validations');

exports.init = app => {
  app.get('/users', isAuthenticated, userController.getAllUsers);
  app.post('/users', validationResultHandler(signUp), userController.signUp);
  app.post('/users/sessions', validationResultHandler(signIn), userController.signIn);
};
