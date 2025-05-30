import React from 'react';

export default function SavingsGoal({ goal, onSetGoal }) {
  return (
    <div>
      <h2>Savings Goal</h2>
      <input 
        type="number" 
        value={goal} 
        onChange={(e) => onSetGoal(Number(e.target.value))} 
      />
    </div>
  );
}