const categoryService = require("../services/category.service");

async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const category = await categoryService.createCategory(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getCategories(userId);
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id, userId);
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully.",
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, userId, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await categoryService.deleteCategory(id, userId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
