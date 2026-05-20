const { Coupon } = require('../models');

// Fetch all coupons
exports.getCoupons = async (req, res) => {
  try {
    const dbCoupons = await Coupon.findAll();
    const formatted = dbCoupons.map(c => ({
      couponID: c.CouponID,
      couponCode: c.CouponCode,
      discountType: c.DiscountType,
      discountValue: Number(c.DiscountValue),
      minOrderAmount: Number(c.MinOrderAmount),
      expiryDate: c.ExpiryDate,
      usageLimit: c.UsageLimit,
      timesUsed: c.TimesUsed,
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Server error fetching coupons' });
  }
};

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { couponCode, discountType, discountValue, minOrderAmount, expiryDate, usageLimit } = req.body;
    const newCoupon = await Coupon.create({
      CouponCode: couponCode,
      DiscountType: discountType,
      DiscountValue: discountValue,
      MinOrderAmount: minOrderAmount || 0,
      ExpiryDate: expiryDate,
      UsageLimit: usageLimit || null,
      TimesUsed: 0,
    });
    res.status(201).json({
      couponID: newCoupon.CouponID,
      couponCode: newCoupon.CouponCode,
      discountType: newCoupon.DiscountType,
      discountValue: Number(newCoupon.DiscountValue),
      minOrderAmount: Number(newCoupon.MinOrderAmount),
      expiryDate: newCoupon.ExpiryDate,
      usageLimit: newCoupon.UsageLimit,
      timesUsed: newCoupon.TimesUsed,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: 'Server error creating coupon' });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    await coupon.destroy();
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ message: 'Server error deleting coupon' });
  }
};
