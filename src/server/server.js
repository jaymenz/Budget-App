import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';

import { checkPayments } from './utils/cron.js';
import Expense from './models/Expense.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PLAID_BASE_URL = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com'
}[process.env.PLAID_ENV || 'sandbox'];

// Create a Plaid Link Token
app.post('/api/create_link_token', async (req, res) => {
  try {
    const response = await axios.post(`${PLAID_BASE_URL}/link/token/create`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: "Finance Tracker",
      language: "en",
      country_codes: ["US"],
      user: { client_user_id: "unique-user-id" },
      products: ["transactions"]
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error('Error creating link token:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange public token for access token
app.post('/api/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) return res.status(400).json({ error: 'Missing public_token' });

  try {
    const response = await axios.post(`${PLAID_BASE_URL}/item/public_token/exchange`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token,
    });
    res.json({ access_token: response.data.access_token });
  } catch (err) {
    console.error('Error exchanging public token:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to exchange public token' });
  }
});

// Get transactions for access token
app.post('/api/transactions', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Missing access_token' });

  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const response = await axios.post(`${PLAID_BASE_URL}/transactions/get`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token,
      start_date: startDate.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });
    res.json({ transactions: response.data.transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add expense
app.post('/api/expenses', async (req, res) => {
  try {
    // TODO: Implement user authentication to get real user ID
    const expense = await Expense.create({
      ...req.body,
      userId: req.user?.id || 'default-user-id'  // placeholder until auth added
    });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Record manual payment
app.post('/api/expenses/:id/payments', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $push: { payments: req.body } },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Run checkPayments every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running scheduled checkPayments job...');
  try {
    await checkPayments();
  } catch (err) {
    console.error('Error in scheduled checkPayments job:', err);
  }
});
