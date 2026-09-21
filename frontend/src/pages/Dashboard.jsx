import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSummary, fetchExpenses } from "../redux/slices/expenseSlice.js";
import { fetchCategories } from "../redux/slices/categorySlice.js";
import SummaryCard from "../components/SummaryCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summary, expenses, loading, error } = useSelector(
    (state) => state.expenses
  );

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFormSuccess = () => {
    setShowAddForm(false);
    dispatch(fetchSummary());
    dispatch(fetchExpenses());
  };

  const recentExpenses = expenses.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Overview</h1>
          <p className="text-sm text-gray-600">
            Summary of your income, expenses, and budget balances
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          {showAddForm ? "Hide Form" : "+ Add Income / Expense"}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {showAddForm && (
        <ExpenseForm
          editingExpense={null}
          onCancelEdit={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {loading && !summary ? (
        <LoadingSpinner message="Calculating financial metrics..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SummaryCard
              title="Total Income"
              amount={summary?.totalIncome || 0}
              type="income"
            />
            <SummaryCard
              title="Total Expenses"
              amount={summary?.totalExpenses || 0}
              type="expense"
            />
            <SummaryCard
              title="Current Balance"
              amount={summary?.balance || 0}
              type="balance"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-gray-800">
                  Recent Transactions
                </h2>
                <Link
                  to="/expenses"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>

              {recentExpenses.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No transactions recorded yet. Click "+ Add Income / Expense" above to record your first transaction.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-3">Title</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentExpenses.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-800">
                            {item.title}
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {item.category?.name || "Uncategorized"}
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {formatDate(item.date)}
                          </td>
                          <td
                            className={`px-5 py-3 text-right font-semibold ${
                              item.type === "income"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {item.type === "income" ? "+" : "-"}
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-300 rounded shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-800">
                  Category Summary
                </h2>
              </div>

              <div className="p-5 flex-1">
                {!summary?.categorySummary ||
                summary.categorySummary.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-6">
                    No expense categories to summarize.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 space-y-3">
                    {summary.categorySummary.map((cat, idx) => (
                      <li
                        key={idx}
                        className="pt-2 flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700 font-medium">
                          {cat.category}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(cat.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
