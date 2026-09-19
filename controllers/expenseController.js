import Expense from "../models/Expense.js";
import { calculateSummary } from "../services/summaryService.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    const expense = new Expense({
      user: req.userId,
      title,
      amount,
      type,
      category: category || null,
      date: date || Date.now(),
      description: description || ""
    });

    await expense.save();

    await expense.populate("category", "name type");

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: {
        expense
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating expense",
      error: error.message
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const filter = { user: req.userId };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const expenses = await Expense.find(filter)
      .populate("category", "name type")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: {
        expenses
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching expenses",
      error: error.message
    });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate("category", "name type");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        expense
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching expense",
      error: error.message
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    delete req.body.user;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate("category", "name type");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: {
        expense
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating expense",
      error: error.message
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting expense",
      error: error.message
    });
  }
};

export const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const summary = await calculateSummary(req.userId, startDate, endDate);

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while generating summary",
      error: error.message
    });
  }
};
