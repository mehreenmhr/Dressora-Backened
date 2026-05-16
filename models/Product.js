const mongoose = require('mongoose');

/**
 * PRODUCT MODEL
 * Defines the schema for our clothing items in MongoDB.
 * Includes validation and relationships to Categories and Sellers.
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true // Ensures no two products have the same SKU
  },
  // Relationship: Each product belongs to one Category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // Relationship: Each product is listed by one Seller (User)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0 // Percentage discount
  },
  mockId: { type: Number } // To help with seeding
}, {
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Product', productSchema);
