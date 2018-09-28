const userController = require('./controllers/user_controller');

exports.init = app => {
  // POST request for creating Book.
  app.post('/users', userController.validate('signup'), userController.signup);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
