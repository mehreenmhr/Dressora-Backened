const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Orders = sequelize.define('Orders', {
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customer',
        key: 'CustomerID',
      },
    },
    OrderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    DiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    FinalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    OrderStatus: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    ShippingAddressID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Address',
        key: 'AddressID',
      },
    },
    BillingAddressID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Address',
        key: 'AddressID',
      },
    },
  }, {
    timestamps: false,
    tableName: 'Orders',
  });

  return Orders;
};

