import React, { useState } from 'react';

function SavingsTracker({ savings, setSavings, currency }) {
  const [add, setAdd] = useState('');

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!add) return;
    setSavings(savings + parseFloat(add));
    setAdd('');
  };

  return (
    <div className="savings-card">
      <h3>🐷 Savings</h3>
      <div className="savings-amount">{currency}{savings.toFixed(2)}</div>
      <form onSubmit={handleDeposit} className="savings-form">
        <input 
          type="number" 
          placeholder={`Amount (${currency})`} 
          value={add} 
          onChange={(e) => setAdd(e.target.value)} 
        />
        {/* The Big Deposit Button */}
        <button type="submit">DEPOSIT</button>
      </form>
    </div>
  );
}
export default SavingsTracker;