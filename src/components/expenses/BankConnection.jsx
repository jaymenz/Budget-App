import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Typography,
  Paper,
  Box,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import Transactions from './Transactions';
import Balances from './Balances';

export default function BankConnection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessTokens, setAccessTokens] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('plaid_access_tokens')) || [];
    setAccessTokens(stored);
  }, []);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await axios.post('/api/create_link_token');
        setLinkToken(response.data.link_token);
      } catch (err) {
        setError('Failed to generate link token');
        console.error(err);
      }
    };
    fetchLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post('/api/exchange_public_token', {
          public_token: publicToken,
          institutionId: metadata.institution?.institution_id,
        });

        const newToken = {
          access_token: res.data.access_token,
          institution_name: metadata.institution?.name || 'Unknown Bank',
        };

        const updatedTokens = [...accessTokens, newToken];
        setAccessTokens(updatedTokens);
        localStorage.setItem('plaid_access_tokens', JSON.stringify(updatedTokens));
      } catch (err) {
        console.error(err);
        setError('Failed to connect account.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Bank Accounts
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && <CircularProgress sx={{ my: 2 }} />}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={open}
          disabled={!ready || loading}
        >
          Connect Another Bank
        </Button>
      </Box>

      {accessTokens.length > 0 ? (
        <>
          <Tabs value={tabIndex} onChange={handleTabChange} textColor="primary">
            <Tab label="Balances" />
            <Tab label="Transactions" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {tabIndex === 0 && <Balances accessTokens={accessTokens} />}
            {tabIndex === 1 && <Transactions accessTokens={accessTokens} />}
          </Box>
        </>
      ) : (
        <Typography variant="body1">No banks connected yet.</Typography>
      )}
    </Paper>
  );
}
