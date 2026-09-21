import LoadingSpinner from "./LoadingSpinner.jsx";

const ExpenseTable = ({ expenses, onEdit, onDelete, loading }) => {
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

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded shadow-sm">
        <LoadingSpinner message="Loading transactions..." />
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded shadow-sm p-12 text-center text-gray-500 text-sm">
        No transactions found matching your criteria.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(expense.date)}
                </td>
                <td className="px-5 py-3.5 font-medium text-gray-900">
                  {expense.title}
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {expense.category?.name || "Uncategorized"}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                      expense.type === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {expense.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-semibold whitespace-nowrap ${
                    expense.type === "income" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {expense.type === "income" ? "+" : "-"}
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500 max-w-xs truncate">
                  {expense.description || "-"}
                </td>
                <td className="px-5 py-3.5 text-center whitespace-nowrap">
                  <div className="inline-flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-blue-600 px-2.5 py-1 rounded font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
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
    </div>
  );
};

export default ExpenseTable;
