import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function NavBar({ activeTab, setActiveTab }) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        showLabels
      >
        <BottomNavigationAction 
          label="Savings" 
          value="savings" 
          icon={<SavingsIcon />} 
        />
        <BottomNavigationAction 
          label="Expenses" 
          value="expenses" 
          icon={<ReceiptIcon />} 
        />
      </BottomNavigation>
    </Paper>
  );
}