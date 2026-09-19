import { body, param } from "express-validator";
import { validate } from "./authValidator.js";

export const categoryIdValidator = [
  param("id")
    .isMongoId().withMessage("Invalid category ID format"),

  validate
];

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long"),

  body("type")
    .notEmpty().withMessage("Category type is required")
    .isIn(["income", "expense"]).withMessage("Type must be either income or expense"),

  validate
];

export const updateCategoryValidator = [
  param("id")
    .isMongoId().withMessage("Invalid category ID format"),

  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Category name cannot be empty")
    .isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long"),

  body("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type must be either income or expense"),

  validate
];
