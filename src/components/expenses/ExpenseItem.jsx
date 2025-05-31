// ExpenseItem.jsx
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { addMonths, isSameMonth, parseISO } from 'date-fns';

const ExpenseItem = ({ expense, transactions = [] }) => {
  const { name, amount, startDate, duration } = expense;

  const start = parseISO(startDate);
  const expectedPayments = Array.from({ length: duration }).map((_, i) => addMonths(start, i));

  const paidMonths = expectedPayments.filter(monthDate =>
    transactions.some(tx =>
      tx.name.toLowerCase().includes(name.toLowerCase()) &&
      isSameMonth(parseISO(tx.date), monthDate)
    )
  ).length;

  const progress = (paidMonths / duration) * 100;

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h6">{name} - ${amount}</Typography>
        <Typography variant="body2">Duration: {duration} months</Typography>
        <Typography variant="body2">Paid Months: {paidMonths} / {duration}</Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;
