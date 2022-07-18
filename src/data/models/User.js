module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['buyer', 'seller'],
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
      ],
    }
  );

  return User;
};
