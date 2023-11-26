const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category');

// Create a new category
router.post('/categories', categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getCategories);

// Get a category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Update a category by ID
router.patch('/categories/:id', categoryController.updateCategoryById);

// Delete a category by ID
router.delete('/categories/:id', categoryController.deleteCategoryById);

module.exports = router;