const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const cors = require('cors');

// 1. Load Environment Variables (e.g., MySQL URI, Port)
dotenv.config();

// 2. Connect to our MySQL Database
console.log('--- Database Connection ---');
connectDB();

const app = express();

// 3. Standard Middleware
// This allows the server to understand JSON data sent in the body of a request
app.use(cors());
app.use(express.json());

// 4. API Routes
// We group our endpoints by their purpose (Products, Categories, Users)
console.log('--- Registering API Routes ---');
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);

// 5. Basic Welcome Route (to check if the server is alive)
app.get('/', (req, res) => {
  res.send('Dressora API is running successfully!');
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SUCCESS: Server is spinning on http://localhost:${PORT}`);
  console.log(`📡 MODE: ${process.env.NODE_ENV || 'development'}`);
  console.log('-----------------------------\n');
});

// Nodemon reload trigger

