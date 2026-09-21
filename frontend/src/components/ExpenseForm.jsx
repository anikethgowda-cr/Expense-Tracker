import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense, updateExpense } from "../redux/slices/expenseSlice.js";

const getInitialFormState = (expense) => {
  if (expense) {
    return {
      title: expense.title || "",
      amount: expense.amount || "",
      type: expense.type || "expense",
      category: expense.category?._id || expense.category || "",
      date: expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      description: expense.description || ""
    };
  }
  return {
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  };
};

const ExpenseForm = ({ editingExpense, onCancelEdit, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState(() => getInitialFormState(editingExpense));
  const [prevEditingExpense, setPrevEditingExpense] = useState(editingExpense);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (editingExpense !== prevEditingExpense) {
    setPrevEditingExpense(editingExpense);
    setFormData(getInitialFormState(editingExpense));
    setErrors({});
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Title is required";
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = "Amount must be a positive number";
    }
    if (!formData.type) {
      errs.type = "Type is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category ? formData.category : null,
      date: formData.date,
      description: formData.description.trim()
    };

    try {
      if (editingExpense) {
        await dispatch(
          updateExpense({ id: editingExpense._id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createExpense(payload)).unwrap();
      }

      setFormData(getInitialFormState());
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrors({ form: err });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = (categories || []).filter(
    (cat) => cat.type === formData.type
  );

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-800">
          {editingExpense ? "Edit Transaction" : "Add New Transaction"}
        </h2>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Transaction Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Grocery Shopping"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.title}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.amount}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="">None / Uncategorized</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional notes"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : editingExpense
              ? "Update Transaction"
              : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
