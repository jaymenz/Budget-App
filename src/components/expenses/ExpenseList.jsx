// ExpenseList.jsx
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, transactions = [] }) => (
  <div>
    {expenses.map((expense, index) => (
      <ExpenseItem key={index} expense={expense} transactions={transactions} />
    ))}
  </div>
);

export default ExpenseList;
