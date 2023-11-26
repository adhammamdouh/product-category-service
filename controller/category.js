const categoryService = require('../services/category');

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send({ error: 'Category not found' });
    }
    res.send(category);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const category = await categoryService.updateCategoryById(req.params.id, req.body);
    res.send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await categoryService.deleteCategoryById(req.params.id);
    res.send(category);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};