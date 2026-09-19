import mongoose from "mongoose";
import Expense from "../models/Expense.js";

export const calculateSummary = async (userId, startDate, endDate) => {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId)
  };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) {
      matchStage.date.$gte = new Date(startDate);
    }
    if (endDate) {
      matchStage.date.$lte = new Date(endDate);
    }
  }

  const totalsResult = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  totalsResult.forEach((item) => {
    if (item._id === "income") {
      totalIncome = item.total;
    } else if (item._id === "expense") {
      totalExpenses = item.total;
    }
  });

  const balance = totalIncome - totalExpenses;

  const categorySummaryResult = await Expense.aggregate([
    {
      $match: {
        ...matchStage,
        type: "expense"
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails"
      }
    },
    {
      $project: {
        _id: 0,
        category: {
          $ifNull: [
            { $arrayElemAt: ["$categoryDetails.name", 0] },
            "Uncategorized"
          ]
        },
        total: { $round: ["$total", 2] }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    balance: Number(balance.toFixed(2)),
    categorySummary: categorySummaryResult
  };
};
