import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoryError
} from "../redux/slices/categorySlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense"
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(clearCategoryError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError("");
    setSuccessMessage("");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type
    });
    setFormError("");
    setSuccessMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "expense"
    });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      setFormError("Category name must be at least 2 characters");
      return;
    }

    setFormError("");
    setSuccessMessage("");

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            data: {
              name: formData.name.trim(),
              type: formData.type
            }
          })
        ).unwrap();
        setSuccessMessage("Category updated successfully");
        setEditingCategory(null);
      } else {
        await dispatch(
          createCategory({
            name: formData.name.trim(),
            type: formData.type
          })
        ).unwrap();
        setSuccessMessage("Category created successfully");
      }

      setFormData({
        name: "",
        type: "expense"
      });
    } catch (err) {
      setFormError(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setFormError("");
      setSuccessMessage("");
      try {
        await dispatch(deleteCategory(id)).unwrap();
        setSuccessMessage("Category deleted successfully");
      } catch (err) {
        setFormError(err);
      }
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (typeFilter === "all") return true;
    return cat.type === typeFilter;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>
        <p className="text-sm text-gray-600">
          Create and manage personal categories for your income and expense records
        </p>
      </div>

      {(formError || error) && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {formError || error}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
          <div className="border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-base font-bold text-gray-800">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Groceries, Freelance"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="expense">Expense Category</option>
                <option value="income">Income Category</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-gray-800">
              Your Categories ({filteredCategories.length})
            </h2>
            <div className="inline-flex rounded border border-gray-300 p-0.5 bg-gray-50 text-xs">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1 rounded font-medium ${
                  typeFilter === "all"
                    ? "bg-white text-gray-800 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("expense")}
                className={`px-3 py-1 rounded font-medium ${
                  typeFilter === "expense"
                    ? "bg-white text-red-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setTypeFilter("income")}
                className={`px-3 py-1 rounded font-medium ${
                  typeFilter === "income"
                    ? "bg-white text-green-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {loading && categories.length === 0 ? (
            <LoadingSpinner message="Loading categories..." />
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No categories found. Create your first category using the form.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Category Name</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            cat.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cat.type === "income" ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-blue-600 px-2.5 py-1 rounded font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-xs bg-white border border-gray-300 hover:bg-red-50 text-red-600 px-2.5 py-1 rounded font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
