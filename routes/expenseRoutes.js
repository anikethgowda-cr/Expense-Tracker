import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from "../controllers/expenseController.js";
import {
  createExpenseValidator,
  updateExpenseValidator,
  expenseIdValidator
} from "../validators/expenseValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createExpenseValidator, createExpense);
router.get("/", protect, getExpenses);
router.get("/summary", protect, getExpenseSummary);
router.get("/:id", protect, expenseIdValidator, getExpenseById);
router.put("/:id", protect, updateExpenseValidator, updateExpense);
router.delete("/:id", protect, expenseIdValidator, deleteExpense);

export default router;
