const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contents.belongsTo(models.Order, {
        foreignKey: 'orderId',
      });
    }
  }
  Contents.init({
    itemId: DataTypes.INTEGER,
    itemName: DataTypes.STRING,
    cost: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Contents',
  });
  return Contents;
};
