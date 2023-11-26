const Category = require('../models/category');

exports.createCategory = async (categoryData) => {
  try {
    const category = new Category(categoryData);
    await category.save();
    return category;
  } catch (error) {
    throw new Error('Could not create the category: ' + error.message);
  }
};

exports.getCategories = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw new Error('Could not fetch categories: ' + error.message);
  }
};

exports.getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    throw new Error('Could not fetch the category: ' + error.message);
  }
};

exports.updateCategoryById = async (categoryId, updates) => {
  const allowedUpdates = ['name', 'description'];
  const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new Error('Invalid updates! Allowed updates: ' + allowedUpdates.join(', '));
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    Object.keys(updates).forEach((update) => (category[update] = updates[update]));
    await category.save();
    return category;
  } catch (error) {
    throw new Error('Could not update the category: ' + error.message);
  }
};

exports.deleteCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error('Could not delete the category: ' + error.message);
  }
};