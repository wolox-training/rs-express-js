const User = require('../models').User;

exports.signup = function(req, res) {
  const { name, lastname, email, password } = req.body;
  User.create({ name, lastname, email, password })
    .then(user => {
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.status(500);
    });
};

// Las contraseñas no deben guardarse de manera plana.
// Se debe loggear un mensaje con el nombre de usuario cuando éste se haya creado correctamente, y uno de error en caso contrario.
// Loggear un error en caso de falla de la base de datos.
