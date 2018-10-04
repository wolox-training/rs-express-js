'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      instanceMethods: {
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
    });
  });
  return User;
};
