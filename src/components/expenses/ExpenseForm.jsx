import { useState } from 'react';

const ExpenseForm = ({ onAddExpense }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      name,
      amount: parseFloat(amount),
      startDate,
      duration: parseInt(duration, 10)
    });
    setName('');
    setAmount('');
    setStartDate('');
    setDuration('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Expense Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        required 
      />
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
        required 
      />
      <input 
        type="number" 
        placeholder="Duration (months)" 
        value={duration} 
        onChange={(e) => setDuration(e.target.value)} 
        required 
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
