import React, { useState, useEffect } from 'react';
import BillForm from './components/BillForm.jsx';
import BillList from './components/BillList.jsx';
import SavingsTracker from './components/SavingsTracker.jsx';
import { advanceDueDate } from './utils/billLogic';
import './App.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function App() {
  const [currency, setCurrency] = useState(() => localStorage.getItem('billguard_currency') || '₱');
  const [savings, setSavings] = useState(() => parseFloat(localStorage.getItem('billguard_savings')) || 0);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('billguard_bills');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('billguard_bills', JSON.stringify(bills));
    localStorage.setItem('billguard_savings', savings);
    localStorage.setItem('billguard_currency', currency);
  }, [bills, savings, currency]);

  const handleAddBill = (newBill) => {
    setBills([...bills, newBill]);
  };

  const handleDeleteBill = (id) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  // ONE-CLICK PAID LOGIC: Deduct Savings + Advance Due Date
  const handleMarkPaid = (bill) => {
    // 1. Deduct amount from savings
    setSavings(prev => prev - bill.amount);

    // 2. Advance due date forward to next cycle
    const currentDueDate = bill.dueDate || bill.lastPaid;
    const nextDueDateStr = advanceDueDate(currentDueDate, bill.frequency);

    setBills(bills.map(b => b.id === bill.id ? { ...b, dueDate: nextDueDateStr } : b));
  };

  return (
    <div className="app">
      {/* HEADER BAR */}
      <header className="app-header">
        <div className="header-top">
          <button 
            className="menu-btn" 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'checklist' : 'dashboard')}
          >
            {activeTab === 'checklist' ? '✕ Close' : '☰ Menu'}
          </button>
          
          <h1>BillGuard</h1>

          <select 
            className="currency-select-top"
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="₱">₱</option>
            <option value="$">$</option>
            <option value="€">€</option>
            <option value="£">£</option>
          </select>
        </div>
      </header>

      {/* NAV SWITCHER */}
      <div className="tab-switcher-nav">
        <button 
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🏠 Dashboard
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'checklist' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          📋 Master Checklist ({bills.length})
        </button>
      </div>

      {/* TAB 1: AUTOMATED 12-MONTH MASTER CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="history-section">
          <h3>📋 Automated Master Checklist</h3>
          <p className="checklist-sub">100% Automatic tracking derived from due dates:</p>
          
          {bills.length === 0 ? (
            <div className="empty-box">
              <p className="empty">No bills added yet!</p>
              <button 
                className="bill-form-btn-small" 
                onClick={() => setActiveTab('dashboard')}
              >
                + Go to Dashboard & Add a Bill
              </button>
            </div>
          ) : (
            <div className="master-checklist">
              {bills.map((bill) => {
                const dateStr = bill.dueDate || bill.lastPaid || '2026-01-01';
                const [yStr, mStr] = dateStr.split('-');
                const dueYear = parseInt(yStr, 10);
                const dueMonth = parseInt(mStr, 10); // 1-12

                return (
                  <div key={bill.id} className="checklist-card">
                    <div className="card-top-info">
                      <div>
                        <strong className="cl-name">{bill.name}</strong>
                        <span className="cl-amount">{currency}{bill.amount.toFixed(2)} — <span className="cl-freq">{bill.frequency}</span></span>
                      </div>
                      <span className="year-badge">{dueYear} Cycle</span>
                    </div>

                    {/* 12-MONTH AUTOMATED GRID */}
                    <div className="month-grid">
                      {MONTHS.map((m, index) => {
                        const monthNumber = index + 1;
                        let statusClass = 'chip-unpaid';
                        let label = m;

                        if (monthNumber < dueMonth) {
                          statusClass = 'chip-paid';
                          label = `✓ ${m}`;
                        } else if (monthNumber === dueMonth) {
                          statusClass = 'chip-due';
                          label = `📍 ${m}`;
                        }

                        return (
                          <div 
                            key={m} 
                            className={`month-chip ${statusClass}`}
                          >
                            {label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MAIN DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <SavingsTracker 
            savings={savings} 
            setSavings={setSavings} 
            currency={currency} 
          />
          
          <BillForm 
            onAddBill={handleAddBill} 
            currency={currency} 
          />
          
          <BillList 
            bills={bills} 
            onDeleteBill={handleDeleteBill} 
            onMarkPaid={handleMarkPaid} 
            currency={currency} 
          />
        </div>
      )}
    </div>
  );
}

export default App;