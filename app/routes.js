const userController = require('./controllers/user_controller');
const { signUp, validationResultHandler } = require('./middlewares/validations');

exports.init = app => {
  app.post('/users', validationResultHandler(signUp), userController.signUp);
};
