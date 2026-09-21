import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator
} from "../validators/categoryValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCategoryValidator, createCategory);
router.get("/", protect, getCategories);
router.put("/:id", protect, updateCategoryValidator, updateCategory);
router.delete("/:id", protect, categoryIdValidator, deleteCategory);

export default router;
