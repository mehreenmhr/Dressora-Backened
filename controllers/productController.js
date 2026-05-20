const { Product, Category } = require('../models');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }]
    });
    // Map to frontend expected format
    const formattedProducts = products.map(p => ({
      productID: p.ProductID,
      productName: p.ProductName,
      description: p.Description,
      basePrice: Number(p.BasePrice),
      stockQuantity: p.StockQuantity,
      sku: p.SKU,
      categoryID: p.Category?.CategoryID,
      categoryName: p.Category?.CategoryName,
      sellerID: p.SellerID,
      isActive: p.IsActive,
      createdAt: p.CreatedAt,
      image: p.Image,
      rating: p.Rating || 0,
      reviewCount: p.ReviewCount || 0,
      discount: p.Discount || 0
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
    const p = await Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    if (p) {
      res.json({
        productID: p.ProductID,
        productName: p.ProductName,
        description: p.Description,
        basePrice: Number(p.BasePrice),
        stockQuantity: p.StockQuantity,
        sku: p.SKU,
        categoryID: p.Category?.CategoryID,
        categoryName: p.Category?.CategoryName,
        sellerID: p.SellerID,
        isActive: p.IsActive,
        createdAt: p.CreatedAt,
        image: p.Image,
        rating: p.Rating || 0,
        reviewCount: p.ReviewCount || 0,
        discount: p.Discount || 0
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Toggle/Update product active status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({ IsActive: isActive });
    res.json({ success: true, message: `Product status updated to ${isActive ? 'active' : 'inactive'}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProductStatus,
};
