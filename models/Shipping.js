const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shipping = sequelize.define('Shipping', {
    ShippingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Orders',
        key: 'OrderID',
      },
    },
    TrackingNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    Carrier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ShippingStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'),
      defaultValue: 'pending',
    },
    ShippedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    EstimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ActualDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'Shipping',
  });

  return Shipping;
};
