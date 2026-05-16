const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

const { users, categories, products } = require('./data/seederData');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Use a loop to ensure 'save' middleware runs (for password hashing)
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const seller = createdUsers.find(u => u.userType === 'seller');

    const createdCategories = await Category.insertMany(categories);

    // Map the category mockId to the real MongoDB _id
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.mockId] = cat._id;
    });

    const sampleProducts = products.map(product => {
      return {
        ...product,
        seller: seller._id,
        category: categoryMap[product.category]
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
