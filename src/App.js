// src/App.jsx
import { useState, useEffect } from 'react';
import { CssBaseline, Container, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SavingsGoal from './components/savings/SavingsGoal';
import ExpenseDashboard from './pages/ExpenseDashboard'; // ✅ Corrected import
import TransactionsTab from './components/transactions/TransactionsTab';
import NavBar from './components/common/NavBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [savingsGoal, setSavingsGoal] = useState(5000);
  const [expenses, setExpenses] = useState({
    mandatory: [],
    unaccounted: [],
  });

  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      const { savingsGoal, expenses } = JSON.parse(savedData);
      setSavingsGoal(savingsGoal);
      setExpenses(expenses);
    }
  }, []);

  useEffect(() => {
    const financeData = { savingsGoal, expenses };
    localStorage.setItem('financeData', JSON.stringify(financeData));
  }, [savingsGoal, expenses]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
          {activeTab === 'savings' && (
            <SavingsGoal goal={savingsGoal} onSetGoal={setSavingsGoal} />
          )}
          {activeTab === 'expenses' && (
            <ExpenseDashboard expenses={expenses} setExpenses={setExpenses} />
          )}
          {activeTab === 'transactions' && <TransactionsTab />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
