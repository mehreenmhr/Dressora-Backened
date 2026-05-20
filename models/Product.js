const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    BasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    StockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    SKU: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ReviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Category',
        key: 'CategoryID',
      },
    },
    SellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Seller',
        key: 'SellerID',
      },
    },
  }, {
    timestamps: false,
    tableName: 'Product',
  });

  return Product;
};

