const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: String,
  name: String,
  description: String,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;