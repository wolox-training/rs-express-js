const userController = require('./controllers/user_controller');
const validate = require('./validations');

exports.init = app => {
  app.post('/users', validate.validationResultHandler(validate.signUp), userController.signUp);
};
