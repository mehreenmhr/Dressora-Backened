const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'OrderID',
      },
    },
    PaymentMethod: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'online', 'cod'),
      allowNull: false,
    },
    PaymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    AmountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    TransactionID: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    PaymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'Payment',
  });

  return Payment;
};
