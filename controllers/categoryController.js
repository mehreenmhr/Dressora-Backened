const Category = require('../models/Category');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    const formattedCategories = categories.map(c => ({
      ...c._doc,
      categoryID: c._id,
      categoryName: c.name
    }));
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCategories,
};
