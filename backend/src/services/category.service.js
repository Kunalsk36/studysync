const categoryRepository = require("../repositories/category.repository");

class CategoryError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function createCategory(userId, categoryData) {
  // Check duplicate name
  const existing = await categoryRepository.findByNameAndUserId(categoryData.name, userId);
  if (existing) {
    throw new CategoryError(`Category '${categoryData.name}' already exists.`, 409);
  }

  const category = await categoryRepository.create({ userId, ...categoryData });
  return category;
}

async function getCategories(userId) {
  return categoryRepository.findAllByUserId(userId);
}

async function getCategoryById(id, userId) {
  const category = await categoryRepository.findById(id, userId);
  if (!category) {
    throw new CategoryError("Category not found.", 404);
  }
  return category;
}

async function updateCategory(id, userId, categoryData) {
  const category = await getCategoryById(id, userId); // Verify ownership/existence

  // Check duplicate name if name is being changed
  if (categoryData.name && categoryData.name.toLowerCase() !== category.name.toLowerCase()) {
    const existing = await categoryRepository.findByNameAndUserId(categoryData.name, userId);
    if (existing) {
      throw new CategoryError(`Category '${categoryData.name}' already exists.`, 409);
    }
  }

  const updated = await categoryRepository.update(id, userId, categoryData);
  return updated;
}

async function deleteCategory(id, userId) {
  const category = await getCategoryById(id, userId); // Verify ownership/existence

  if (category.is_default) {
    throw new CategoryError("Default categories cannot be deleted.", 403);
  }

  await categoryRepository.remove(id, userId);
  return true;
}

module.exports = {
  CategoryError,
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
