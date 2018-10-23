const userController = require('./controllers/user_controller');
const {
  signUp,
  validationResultHandler,
  signIn,
  isAuthenticated,
  isAdmin
} = require('./middlewares/validations');

exports.init = app => {
  app.get('/users', isAuthenticated, userController.getAllUsers);
  app.post('/users', validationResultHandler(signUp), userController.signUp);
  app.post('/users/sessions', validationResultHandler(signIn), userController.signIn);
  app.post(
    '/users/admin',
    validationResultHandler(signUp),
    isAuthenticated,
    isAdmin,
    userController.createAdminUser
  );
};
