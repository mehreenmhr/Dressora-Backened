const { sequelize } = require('../config/db');

// Load all models
const User = require('./User')(sequelize);
const Customer = require('./Customer')(sequelize);
const Seller = require('./Seller')(sequelize);
const Admin = require('./Admin')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Address = require('./Address')(sequelize);
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Orders = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Payment = require('./Payment')(sequelize);
const Shipping = require('./Shipping')(sequelize);
const Review = require('./Review')(sequelize);
const Coupon = require('./Coupon')(sequelize);
const OrderCoupon = require('./OrderCoupon')(sequelize);

// Define associations
// User relationships
User.hasOne(Customer, { foreignKey: 'UserID', onDelete: 'CASCADE' });
User.hasOne(Seller, { foreignKey: 'UserID', onDelete: 'CASCADE' });
User.hasOne(Admin, { foreignKey: 'UserID', onDelete: 'CASCADE' });
Customer.belongsTo(User, { foreignKey: 'UserID' });
Seller.belongsTo(User, { foreignKey: 'UserID' });
Admin.belongsTo(User, { foreignKey: 'UserID' });

// Category self-reference for sub-categories
Category.hasMany(Category, { as: 'SubCategories', foreignKey: 'ParentCategoryID' });
Category.belongsTo(Category, { as: 'ParentCategory', foreignKey: 'ParentCategoryID' });

// Category -> Product
Category.hasMany(Product, { foreignKey: 'CategoryID', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'CategoryID' });

// Seller -> Product
Seller.hasMany(Product, { foreignKey: 'SellerID', onDelete: 'CASCADE' });
Product.belongsTo(Seller, { foreignKey: 'SellerID' });

// Customer -> Address
Customer.hasMany(Address, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Address.belongsTo(Customer, { foreignKey: 'CustomerID' });

// Customer -> Cart
Customer.hasOne(Cart, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Cart.belongsTo(Customer, { foreignKey: 'CustomerID' });

// Cart -> CartItem
Cart.hasMany(CartItem, { foreignKey: 'CartID', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'CartID' });

// Product -> CartItem
Product.hasMany(CartItem, { foreignKey: 'ProductID', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'ProductID' });

// Customer -> Orders
Customer.hasMany(Orders, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Orders.belongsTo(Customer, { foreignKey: 'CustomerID' });

// Address -> Orders (Shipping & Billing)
Address.hasMany(Orders, { as: 'ShippingOrders', foreignKey: 'ShippingAddressID' });
Address.hasMany(Orders, { as: 'BillingOrders', foreignKey: 'BillingAddressID' });
Orders.belongsTo(Address, { as: 'ShippingAddress', foreignKey: 'ShippingAddressID' });
Orders.belongsTo(Address, { as: 'BillingAddress', foreignKey: 'BillingAddressID' });

// Orders -> OrderItem
Orders.hasMany(OrderItem, { foreignKey: 'OrderID', onDelete: 'CASCADE' });
OrderItem.belongsTo(Orders, { foreignKey: 'OrderID' });

// Product -> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'ProductID', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductID' });

// Orders -> Payment
Orders.hasMany(Payment, { foreignKey: 'OrderID', onDelete: 'CASCADE' });
Payment.belongsTo(Orders, { foreignKey: 'OrderID' });

// Orders -> Shipping
Orders.hasOne(Shipping, { foreignKey: 'OrderID', onDelete: 'CASCADE' });
Shipping.belongsTo(Orders, { foreignKey: 'OrderID' });

// Product -> Review
Product.hasMany(Review, { foreignKey: 'ProductID', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'ProductID' });

// Customer -> Review
Customer.hasMany(Review, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
Review.belongsTo(Customer, { foreignKey: 'CustomerID' });

// Orders -> OrderCoupon
Orders.hasMany(OrderCoupon, { foreignKey: 'OrderID', onDelete: 'CASCADE' });
OrderCoupon.belongsTo(Orders, { foreignKey: 'OrderID' });

// Coupon -> OrderCoupon
Coupon.hasMany(OrderCoupon, { foreignKey: 'CouponID', onDelete: 'CASCADE' });
OrderCoupon.belongsTo(Coupon, { foreignKey: 'CouponID' });

module.exports = {
  sequelize,
  User,
  Customer,
  Seller,
  Admin,
  Category,
  Product,
  Address,
  Cart,
  CartItem,
  Orders,
  OrderItem,
  Payment,
  Shipping,
  Review,
  Coupon,
  OrderCoupon,
};
