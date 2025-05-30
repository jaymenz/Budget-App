import { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

export default function Balances({ accessTokens }) {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const results = await Promise.all(
        accessTokens.map(async ({ access_token, institution_name }) => {
          try {
            const res = await axios.post('/api/balances', { access_token });
            return { institution_name, accounts: res.data.accounts };
          } catch (err) {
            console.error('Balance error:', err);
            return { institution_name, accounts: [] };
          }
        })
      );
      setBalances(results);
    };

    fetchBalances();
  }, [accessTokens]);

  return (
    <div>
      {balances.map(({ institution_name, accounts }) => (
        <div key={institution_name} style={{ marginBottom: '1rem' }}>
          <Typography variant="h6">{institution_name}</Typography>
          <List dense>
            {accounts.map(account => (
              <ListItem key={account.account_id}>
                <ListItemText
                  primary={`${account.name} (${account.subtype})`}
                  secondary={
                    account.balances
                      ? `Available: $${account.balances.available?.toFixed(2) ?? 'N/A'} | Current: $${account.balances.current?.toFixed(2) ?? 'N/A'}`
                      : 'Balance not available'
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}
