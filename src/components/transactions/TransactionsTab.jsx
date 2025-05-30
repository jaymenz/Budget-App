import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

export default function TransactionsTab() {
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch link token from backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const res = await axios.post('/api/create_link_token');
        setLinkToken(res.data.link_token);
      } catch (err) {
        console.error('Error fetching link token', err);
      }
    };
    fetchLinkToken();
  }, []);

  // On success callback from Plaid Link
  const onSuccess = useCallback(async (public_token) => {
    try {
      // Exchange public token for access token
      const res = await axios.post('/api/exchange_public_token', { public_token });
      setAccessToken(res.data.access_token);
    } catch (err) {
      console.error('Error exchanging public token:', err);
    }
  }, []);

  // Configure Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  // Fetch transactions when access token is set
  useEffect(() => {
    if (!accessToken) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/transactions', { access_token: accessToken });
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [accessToken]);

  return (
    <div>
      <Button variant="contained" onClick={() => open()} disabled={!ready || !linkToken}>
        Connect Bank
      </Button>

      {loading && <Typography>Loading transactions...</Typography>}

      {!loading && transactions.length > 0 && (
        <List>
          {transactions.map((txn) => (
            <div key={txn.transaction_id}>
              <ListItem>
                <ListItemText
                  primary={txn.name}
                  secondary={`${txn.date} — $${txn.amount.toFixed(2)}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}

      {!loading && accessToken && transactions.length === 0 && (
        <Typography>No transactions found.</Typography>
      )}
    </div>
  );
}
