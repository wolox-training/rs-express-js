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
// Para registrarse el usuario debe poder realizar una http request (POST) a “/users” con los campos mencionados.
// El email debe ser válido y perteneciente al dominio de los emails de Wolox.
// El email debe ser único (no se puede repetir).
// Validar contraseñas alfanuméricas con longitud mínima de 8 caracteres.
// Las contraseñas no deben guardarse de manera plana.
// Se debe loggear un mensaje con el nombre de usuario cuando éste se haya creado correctamente, y uno de error en caso contrario.
// Loggear un error en caso de falla de la base de datos.
