const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderCoupon = sequelize.define('OrderCoupon', {
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Orders',
        key: 'OrderID',
      },
    },
    CouponID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Coupon',
        key: 'CouponID',
      },
    },
    AppliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'OrderCoupon',
  });

  return OrderCoupon;
};
