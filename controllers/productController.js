const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category');
    // Map to frontend expected format
    const formattedProducts = products.map(p => ({
      ...p._doc,
      productID: p._id,
      productName: p.name,
      basePrice: p.price,
      categoryID: p.category?._id,
      categoryName: p.category?.name,
      image: p.image
    }));
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('category');
    if (p) {
      res.json({
        ...p._doc,
        productID: p._id,
        productName: p.name,
        basePrice: p.price,
        categoryID: p.category?._id,
        categoryName: p.category?.name,
        image: p.image
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
