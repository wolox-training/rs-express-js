const userController = require('./controllers/user_controller');
const { signUp, validationResultHandler, signIn } = require('./middlewares/validations');

exports.init = app => {
  app.post('/users', validationResultHandler(signUp), userController.signUp);
  app.post('/users/sessions', validationResultHandler(signIn), userController.signIn);
};
