const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    ReviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'ProductID',
      },
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customer',
        key: 'CustomerID',
      },
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    ReviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ReviewDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    IsVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: false,
    tableName: 'Review',
    indexes: [
      {
        unique: true,
        fields: ['ProductID', 'CustomerID'],
      },
    ],
  });

  return Review;
};
