const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coupon = sequelize.define('Coupon', {
    CouponID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CouponCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    DiscountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    DiscountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    MinOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    ExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UsageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TimesUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    tableName: 'Coupon',
  });

  return Coupon;
};
