/**
 * CATEGORY ROUTES
 * Handles all requests related to product categories.
 */
const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// @route   GET /api/categories
// @desc    Retrieve all categories from the database
// @access  Public
router.get('/', getCategories);

module.exports = router;
