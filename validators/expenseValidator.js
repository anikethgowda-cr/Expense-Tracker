import { body, param } from "express-validator";
import { validate } from "./authValidator.js";

export const expenseIdValidator = [
  param("id")
    .isMongoId().withMessage("Invalid expense ID format"),

  validate
];

export const createExpenseValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required"),

  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["income", "expense"]).withMessage("Type must be either income or expense"),

  body("category")
    .optional({ nullable: true })
    .isMongoId().withMessage("Category must be a valid ID"),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date format (YYYY-MM-DD)"),

  body("description")
    .optional()
    .trim(),

  validate
];

export const updateExpenseValidator = [
  param("id")
    .isMongoId().withMessage("Invalid expense ID format"),

  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty"),

  body("amount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),

  body("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type must be either income or expense"),

  body("category")
    .optional({ nullable: true })
    .isMongoId().withMessage("Category must be a valid ID"),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date format (YYYY-MM-DD)"),

  body("description")
    .optional()
    .trim(),

  validate
];
