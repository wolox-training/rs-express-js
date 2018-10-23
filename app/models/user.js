const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  });

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
    });
  });

  return User;
};
