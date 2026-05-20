const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Seller = sequelize.define('Seller', {
    SellerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'User',
        key: 'UserID',
      },
    },
    StoreName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StoreDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    JoinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'Seller',
  });

  return Seller;
};
