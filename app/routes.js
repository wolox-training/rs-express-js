const userController = require('./controllers/user_controller');
const validations = require('./validations');

exports.init = app => {
  app.post('/users', validations.validateUser, userController.signup);
};
