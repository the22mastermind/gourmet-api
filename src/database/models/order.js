'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.Contents, {
        foreignKey: 'orderId',
      });
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  };
  Order.init({
    total: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    paymentId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};