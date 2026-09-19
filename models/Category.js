import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"]
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true
    },
    type: {
      type: String,
      required: [true, "Category type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense"
      }
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
