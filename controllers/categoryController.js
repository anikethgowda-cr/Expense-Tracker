import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const existingCategory = await Category.findOne({
      user: req.userId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
      type
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists for this type"
      });
    }

    const category = new Category({
      user: req.userId,
      name,
      type
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating category",
      error: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const filter = { user: req.userId };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const categories = await Category.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching categories",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    delete req.body.user;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating category",
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const linkedExpenseCount = await Expense.countDocuments({
      category: req.params.id
    });

    if (linkedExpenseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it is currently linked to ${linkedExpenseCount} transaction(s). Please reassign or delete those transactions first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting category",
      error: error.message
    });
  }
};
