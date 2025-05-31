import { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent 
} from '@mui/material';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import BankConnection from '../components/expenses/BankConnection';

export default function ExpenseDashboard({ expenses, setExpenses }) {
  const [tabValue, setTabValue] = useState('mandatory');
  const [openForm, setOpenForm] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [connectedBank, setConnectedBank] = useState(() => localStorage.getItem('connected_bank_name'));

  const handleAddExpense = (newExpense, type) => {
    setExpenses(prev => ({
      ...prev,
      [type]: [...prev[type], newExpense]
    }));
    setOpenForm(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Expense Management
      </Typography>
      
      {connectedBank && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Connected Bank: <strong>{connectedBank}</strong>
        </Typography>
      )}

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Mandatory" value="mandatory" />
        <Tab label="Unaccounted" value="unaccounted" />
      </Tabs>
      
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mr: 2 }}>
          Add Expense
        </Button>
        <Button variant="outlined" onClick={() => setOpenBankDialog(true)}>
          Connect Bank
        </Button>
      </Box>
      
      <ExpenseList 
        expenses={expenses[tabValue]} 
        type={tabValue}
        onUpdate={(updated) => setExpenses(prev => ({
          ...prev,
          [tabValue]: updated
        }))}
      />
      
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <ExpenseForm 
            type={tabValue}
            onAddExpense={(data) => handleAddExpense({
              ...data,
              id: Date.now(),
              date: new Date().toISOString().split('T')[0],
              paidMonths: tabValue === 'mandatory' ? 0 : undefined,
              durationMonths: tabValue === 'mandatory' ? 12 : undefined
            }, tabValue)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={openBankDialog} 
        onClose={() => setOpenBankDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Connect Your Bank</DialogTitle>
        <DialogContent>
          <BankConnection 
            onTransactionsReceived={(data) => {
              setTransactions(data);
              setOpenBankDialog(false);
              const bank = localStorage.getItem('connected_bank_name');
              if (bank) setConnectedBank(bank);
            }} 
          />
        </DialogContent>
      </Dialog>

      {transactions.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          {transactions.map((tx, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="body2">
                {tx.date} - {tx.description} - ${tx.amount.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
