const SummaryCard = ({ title, amount = 0, type = "neutral" }) => {
  const getAmountColor = () => {
    if (type === "income") return "text-green-700";
    if (type === "expense") return "text-red-700";
    if (type === "balance") return "text-blue-700";
    return "text-gray-900";
  };

  const getBorderColor = () => {
    if (type === "income") return "border-l-4 border-l-green-600";
    if (type === "expense") return "border-l-4 border-l-red-600";
    if (type === "balance") return "border-l-4 border-l-blue-600";
    return "border-l-4 border-l-gray-400";
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);

  return (
    <div className={`bg-white border border-gray-300 rounded shadow-sm p-5 ${getBorderColor()}`}>
      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </span>
      <div className={`text-2xl font-bold ${getAmountColor()}`}>
        {formattedAmount}
      </div>
    </div>
  );
};

export default SummaryCard;
