const mongoose = require('mongoose');
const { sequelize, User, Customer, Seller, Admin, Category, Product, Address, Cart, CartItem, Orders, OrderItem, Payment, Shipping, Review, Coupon, OrderCoupon } = require('./models');
require('dotenv').config();

// MongoDB models for reading
const mongooseUserSchema = require('./mongoModels/User');
const mongooseCategorySchema = require('./mongoModels/Category');
const mongooseProductSchema = require('./mongoModels/Product');
const mongooseOrderSchema = require('./mongoModels/Order');

const migrateData = async () => {
  try {
    console.log('🔄 Starting Data Migration from MongoDB to MySQL...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dressora');
    console.log('✅ MongoDB Connected');

    // Connect to MySQL via Sequelize
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');

    // Sync all models (force: true drops existing tables to start clean)
    await sequelize.sync({ force: true });
    console.log('✅ Database schema synced\n');

    // 1. Migrate Users
    console.log('📋 Migrating Users...');
    const mongoUsers = await mongooseUserSchema.find();
    const userMap = new Map();
    for (const mongoUser of mongoUsers) {
      const [sqlUser] = await User.findOrCreate({
        where: { Email: mongoUser.email },
        defaults: {
          Email: mongoUser.email,
          PasswordHash: mongoUser.password,
          PhoneNumber: mongoUser.phoneNumber || null,
          UserType: mongoUser.userType || 'customer',
          IsActive: mongoUser.isActive !== undefined ? mongoUser.isActive : true,
          DateRegistered: mongoUser.createdAt || new Date(),
        },
      });
      userMap.set(mongoUser._id.toString(), sqlUser.UserID);
    }
    console.log(`✅ Migrated ${mongoUsers.length} users\n`);

    // 2. Migrate Categories
    console.log('📋 Migrating Categories...');
    const mongoCategories = await mongooseCategorySchema.find();
    const categoryMap = new Map();
    
    for (const mongoCategory of mongoCategories) {
      const sqlCategory = await Category.create({
        CategoryName: mongoCategory.name,
        Description: mongoCategory.description || null,
        ParentCategoryID: null, // We'll handle hierarchies in a second pass
        Icon: mongoCategory.icon || null,
      });
      categoryMap.set(mongoCategory._id.toString(), sqlCategory.CategoryID);
    }
    console.log(`✅ Migrated ${mongoCategories.length} categories\n`);

    // 3. Migrate Sellers and Customers
    console.log('📋 Migrating Sellers and Customers...');
    const sqlUsers = await User.findAll();
    for (const sqlUser of sqlUsers) {
      if (sqlUser.UserType === 'seller') {
        await Seller.findOrCreate({
          where: { UserID: sqlUser.UserID },
          defaults: {
            UserID: sqlUser.UserID,
            StoreName: `Store of ${sqlUser.Email}`,
            StoreDescription: null,
            Rating: 0,
            JoinedAt: sqlUser.DateRegistered,
          },
        });
      } else if (sqlUser.UserType === 'customer') {
        const newCustomer = await Customer.findOrCreate({
          where: { UserID: sqlUser.UserID },
          defaults: {
            UserID: sqlUser.UserID,
            FirstName: sqlUser.Email.split('@')[0],
            LastName: null,
            DateOfBirth: null,
            LoyaltyPoints: 0,
          },
        });
        
        // Create a cart for the customer
        await Cart.findOrCreate({
          where: { CustomerID: newCustomer[0].CustomerID },
          defaults: {
            CustomerID: newCustomer[0].CustomerID,
            Status: 'active',
          },
        });

        // Seed addresses to prevent foreign key errors during checkout
        if (newCustomer[0].CustomerID === 1) {
          await Address.findOrCreate({
            where: { AddressID: 1 },
            defaults: {
              AddressID: 1,
              CustomerID: 1,
              Street: "House 12, Block B, Gulberg III",
              City: "Lahore",
              State: "Punjab",
              PostalCode: "54000",
              Country: "Pakistan",
              AddressType: "both",
              IsDefault: true,
            },
          });
          await Address.findOrCreate({
            where: { AddressID: 2 },
            defaults: {
              AddressID: 2,
              CustomerID: 1,
              Street: "Office 5, DHA Phase 5",
              City: "Lahore",
              State: "Punjab",
              PostalCode: "54792",
              Country: "Pakistan",
              AddressType: "both",
              IsDefault: false,
            },
          });
        } else if (newCustomer[0].CustomerID === 2) {
          await Address.findOrCreate({
            where: { AddressID: 3 },
            defaults: {
              AddressID: 3,
              CustomerID: 2,
              Street: "Flat 3, F-10 Markaz",
              City: "Islamabad",
              State: "ICT",
              PostalCode: "44000",
              Country: "Pakistan",
              AddressType: "both",
              IsDefault: true,
            },
          });
        }
      } else if (sqlUser.UserType === 'admin') {
        await Admin.findOrCreate({
          where: { UserID: sqlUser.UserID },
          defaults: {
            UserID: sqlUser.UserID,
            AdminLevel: 1,
            LastLogin: null,
          },
        });
      }
    }
    console.log(`✅ Migrated sellers and customers\n`);

    // 4. Migrate Products
    console.log('📋 Migrating Products...');
    const mongoProducts = await mongooseProductSchema.find();
    const productMap = new Map();
    
    for (const mongoProduct of mongoProducts) {
      const categoryID = categoryMap.get(mongoProduct.category?.toString());
      const mysqlUserID = userMap.get(mongoProduct.seller?.toString());
      const seller = mysqlUserID ? await Seller.findOne({ where: { UserID: mysqlUserID } }) : null;
      
      if (categoryID && seller) {
        const sqlProduct = await Product.create({
          ProductName: mongoProduct.name,
          Description: mongoProduct.description,
          BasePrice: mongoProduct.price || 0,
          StockQuantity: mongoProduct.stockQuantity || 0,
          SKU: mongoProduct.sku,
          IsActive: mongoProduct.isActive !== undefined ? mongoProduct.isActive : true,
          CreatedAt: mongoProduct.createdAt || new Date(),
          CategoryID: categoryID,
          SellerID: seller.SellerID,
          Image: mongoProduct.image,
          Rating: mongoProduct.rating || 0,
          ReviewCount: mongoProduct.reviewCount || 0,
          Discount: mongoProduct.discount || 0,
        });
        productMap.set(mongoProduct._id.toString(), sqlProduct.ProductID);
      } else {
        console.log(`⚠️ Skipped product ${mongoProduct.name} - Category: ${categoryID}, Seller: ${seller ? seller.SellerID : 'null'}`);
      }
    }
    console.log(`✅ Migrated ${mongoProducts.length} products\n`);

    // 5. Migrate Orders
    console.log('📋 Migrating Orders...');
    const mongoOrders = await mongooseOrderSchema.find().populate('user').populate('orderItems.product');
    
    for (const mongoOrder of mongoOrders) {
      const mongoUserId = mongoOrder.user?._id ? mongoOrder.user._id.toString() : mongoOrder.user?.toString();
      const mysqlUserID = userMap.get(mongoUserId);
      const customer = mysqlUserID ? await Customer.findOne({ where: { UserID: mysqlUserID } }) : null;
      
      if (customer) {
        const sqlOrder = await Orders.create({
          CustomerID: customer.CustomerID,
          OrderDate: mongoOrder.createdAt || new Date(),
          TotalAmount: mongoOrder.totalPrice || mongoOrder.itemsPrice || 0,
          DiscountAmount: 0,
          TaxAmount: mongoOrder.taxPrice || 0,
          FinalAmount: mongoOrder.totalPrice || mongoOrder.itemsPrice || 0,
          OrderStatus: mongoOrder.isPaid ? 'processing' : 'pending',
          ShippingAddressID: null, // Will require manual mapping if addresses exist
          BillingAddressID: null,
        });

        // Migrate order items
        if (mongoOrder.orderItems && Array.isArray(mongoOrder.orderItems)) {
          for (const mongoOrderItem of mongoOrder.orderItems) {
            const mongoProductId = mongoOrderItem.product?._id ? mongoOrderItem.product._id.toString() : mongoOrderItem.product?.toString();
            const productID = productMap.get(mongoProductId);
            if (productID) {
              await OrderItem.create({
                OrderID: sqlOrder.OrderID,
                ProductID: productID,
                Quantity: mongoOrderItem.quantity || 1,
                UnitPrice: mongoOrderItem.price || 0,
                Subtotal: (mongoOrderItem.quantity || 1) * (mongoOrderItem.price || 0),
              });
            }
          }
        }

        // Create payment record if order was paid
        if (mongoOrder.isPaid) {
          await Payment.create({
            OrderID: sqlOrder.OrderID,
            PaymentMethod: mongoOrder.paymentMethod || 'credit_card',
            PaymentStatus: 'completed',
            AmountPaid: mongoOrder.totalPrice || mongoOrder.itemsPrice || 0,
            TransactionID: null,
            PaymentDate: mongoOrder.paidAt || new Date(),
          });
        }
      }
    }
    console.log(`✅ Migrated ${mongoOrders.length} orders\n`);

    // 6. Migrate/Seed Coupons
    console.log('📋 Seeding Coupons...');
    const defaultCoupons = [
      { CouponCode: "WELCOME20", DiscountType: "percentage", DiscountValue: 20, MinOrderAmount: 2000, ExpiryDate: new Date("2026-12-31"), UsageLimit: 100, TimesUsed: 34 },
      { CouponCode: "FLAT500", DiscountType: "fixed", DiscountValue: 500, MinOrderAmount: 3000, ExpiryDate: new Date("2026-07-31"), UsageLimit: 50, TimesUsed: 12 },
      { CouponCode: "SUMMER15", DiscountType: "percentage", DiscountValue: 15, MinOrderAmount: 1500, ExpiryDate: new Date("2026-06-30"), UsageLimit: 200, TimesUsed: 87 },
      { CouponCode: "FLASH30", DiscountType: "percentage", DiscountValue: 30, MinOrderAmount: 5000, ExpiryDate: new Date("2026-05-31"), UsageLimit: 25, TimesUsed: 25 },
    ];
    for (const c of defaultCoupons) {
      await Coupon.findOrCreate({
        where: { CouponCode: c.CouponCode },
        defaults: c,
      });
    }
    console.log(`✅ Seeded ${defaultCoupons.length} coupons\n`);

    console.log('✅✅✅ Data Migration Completed Successfully! ✅✅✅\n');
    console.log('📊 Summary:');
    console.log(`   • Users: ${sqlUsers.length}`);
    console.log(`   • Categories: ${mongoCategories.length}`);
    console.log(`   • Products: ${mongoProducts.length}`);
    console.log(`   • Orders: ${mongoOrders.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
};

// Run migration if this is the main module
if (require.main === module) {
  migrateData();
}

module.exports = migrateData;
