import axios from 'axios';

const PLAID_BASE_URL = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com'
}[process.env.REACT_APP_PLAID_ENV];

export const createLinkToken = async () => {
  const res = await axios.post(`${PLAID_BASE_URL}/link/token/create`, {
    client_id: process.env.REACT_APP_PLAID_CLIENT_ID,
    secret: process.env.REACT_APP_PLAID_SECRET,
    client_name: "Finance Tracker",
    language: "en",
    country_codes: ["US"],
    user: { client_user_id: "user-id" },
    products: ["transactions"]
  });
  return res.data.link_token;
};

export const exchangePublicToken = async (publicToken) => {
  const res = await axios.post(`${PLAID_BASE_URL}/item/public_token/exchange`, {
    client_id: process.env.REACT_APP_PLAID_CLIENT_ID,
    secret: process.env.REACT_APP_PLAID_SECRET,
    public_token: publicToken
  });
  return res.data.access_token;
};

export const getTransactions = async (accessToken) => {
  const res = await axios.post(`${PLAID_BASE_URL}/transactions/get`, {
    client_id: process.env.REACT_APP_PLAID_CLIENT_ID,
    secret: process.env.REACT_APP_PLAID_SECRET,
    access_token: accessToken,
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  return res.data.transactions;
};

