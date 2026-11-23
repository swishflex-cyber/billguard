import React, { useState } from 'react';

function BillForm({ onAddBill }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [lastPaid, setLastPaid] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !lastPaid) return;

    const newBill = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      lastPaid,
      frequency
    };

    onAddBill(newBill);
    setName('');
    setAmount('');
    setLastPaid('');
  };

  return (
    <form className="bill-form" onSubmit={handleSubmit}>
      <h3>Add New Bill</h3>
      <input type="text" placeholder="Bill Name (e.g., Water)" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Amount (₱)" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" />
      <input type="date" value={lastPaid} onChange={(e) => setLastPaid(e.target.value)} />
      <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
      <button type="submit">Add Bill</button>
    </form>
  );
}

export default BillForm;
