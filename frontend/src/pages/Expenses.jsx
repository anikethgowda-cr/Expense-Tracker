import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, deleteExpense } from "../redux/slices/expenseSlice.js";
import { fetchCategories } from "../redux/slices/categorySlice.js";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expenses);
  const { categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    dispatch(fetchExpenses(params));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: ""
    });
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteExpense(id));
    }
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    setShowForm(false);
    dispatch(fetchExpenses(filters));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Transaction Management
          </h1>
          <p className="text-sm text-gray-600">
            Record, monitor, and filter your personal income and expenses
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          {showForm && !editingExpense ? "Hide Form" : "+ New Transaction"}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <ExpenseForm
          editingExpense={editingExpense}
          onCancelEdit={() => {
            setEditingExpense(null);
            setShowForm(false);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="bg-white border border-gray-300 rounded shadow-sm p-4">
        <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
          Filter Transactions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">From Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">To Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {(filters.type ||
          filters.category ||
          filters.startDate ||
          filters.endDate) && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default Expenses;
