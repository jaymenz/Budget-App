import axios from 'axios';
import Expense from '../models/Expense.js';
import User from '../models/User.js'; // Assuming you have a User model with access tokens

const PLAID_BASE_URL = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com'
}[process.env.PLAID_ENV || 'sandbox'];

export async function checkPayments() {
  try {
    console.log('Running scheduled payment check...');

    // Fetch all users who have an accessToken stored
    const users = await User.find({ accessToken: { $exists: true, $ne: null } });

    for (const user of users) {
      const accessToken = user.accessToken;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // last 30 days

      const response = await axios.post(`${PLAID_BASE_URL}/transactions/get`, {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        access_token: accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });

      const transactions = response.data.transactions;

      // Example: for each transaction, try to match an expense and add payment
      for (const tx of transactions) {
        // Find expense by user and maybe matching transaction name (you can improve matching logic)
        const expense = await Expense.findOne({
          userId: user._id,
          name: { $regex: new RegExp(tx.name, 'i') },
        });

        if (expense) {
          // Check if payment with same amount and date exists to avoid duplicates
          const alreadyPaid = expense.payments.some(
            (p) => p.amount === tx.amount && p.date.toISOString().startsWith(tx.date)
          );

          if (!alreadyPaid) {
            expense.payments.push({ amount: tx.amount, date: tx.date });
            await expense.save();
            console.log(`Added payment for expense ${expense.name} from transaction ${tx.name}`);
          }
        }
      }
    }

    console.log('Scheduled payment check complete.');
  } catch (error) {
    console.error('Error checking payments:', error);
  }
}
