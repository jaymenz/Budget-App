import { useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import axios from 'axios';

export default function Transactions({ accessTokens }) {
  const [transactionsData, setTransactionsData] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const results = await Promise.all(
        accessTokens.map(async ({ access_token, institution_name }) => {
          try {
            const res = await axios.post('/api/transactions', { access_token });
            return { institution_name, transactions: res.data.transactions };
          } catch (err) {
            console.error('Transactions error:', err);
            return { institution_name, transactions: [] };
          }
        })
      );
      setTransactionsData(results);
      if (results.length > 0) {
        setSelectedInstitution(results[0].institution_name);
      }
    };

    fetchTransactions();
  }, [accessTokens]);

  const filteredTransactions = transactionsData.find(
    (t) => t.institution_name === selectedInstitution
  );

  return (
    <div>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Bank</InputLabel>
        <Select
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}
          label="Select Bank"
        >
          {transactionsData.map(({ institution_name }) => (
            <MenuItem key={institution_name} value={institution_name}>
              {institution_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredTransactions ? (
        <Box>
          <Typography variant="h6">{selectedInstitution}</Typography>
          <List dense>
            {filteredTransactions.transactions.map((txn) => (
              <div key={txn.transaction_id}>
                <ListItem>
                  <ListItemText
                    primary={txn.name}
                    secondary={`$${txn.amount.toFixed(2)} • ${txn.date}`}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      ) : (
        <Typography>No transactions available.</Typography>
      )}
    </div>
  );
}
