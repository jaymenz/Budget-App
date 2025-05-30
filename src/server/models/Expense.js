// src/server/models/Expense.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: Date,
  method: String,
});

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: String,
  amount: Number,
  category: String,
  date: Date,
  payments: [paymentSchema],
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
