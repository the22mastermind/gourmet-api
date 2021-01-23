'use strict';

import roles from '../../utils/roles';

const {CUSTOMER, STAFF, ADMIN} = roles;

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: 'userId',
      });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    role: DataTypes.ENUM(CUSTOMER, STAFF, ADMIN),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};