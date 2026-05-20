const { Category } = require('../models');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    const formattedCategories = categories.map(c => ({
      categoryID: c.CategoryID,
      categoryName: c.CategoryName,
      description: c.Description,
      icon: c.Icon,
      parentCategoryID: c.ParentCategoryID
    }));
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCategories,
};
