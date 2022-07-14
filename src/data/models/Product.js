const User = require('./User');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amountAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: false,
          fields: ['sellerId'],
        },
      ],
    }
  );

  Product.belongsTo(User(sequelize, DataTypes), {
    foreignKey: 'id',
    targerKey: 'sellerId',
  });

  return Product;
};
