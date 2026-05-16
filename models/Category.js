const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    mockId: { type: Number } // To help with seeding mapping
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
