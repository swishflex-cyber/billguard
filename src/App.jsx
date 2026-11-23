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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'checklist'
  const [selectedList, setSelectedList] = useState('monthly');

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

  const handleMarkPaid = (bill) => {
    setSavings(prev => prev - bill.amount);
    const currentDueDate = bill.dueDate || bill.lastPaid;
    const nextDueDateStr = advanceDueDate(currentDueDate, bill.frequency);
    setBills(bills.map(b => b.id === bill.id ? { ...b, dueDate: nextDueDateStr } : b));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      {/* HEADER BAR - Cleaned up, no menu dropdown */}
      <header className="app-header">
        <div className="header-top">
          <h1>BillGuard</h1>
          <div className="header-controls">
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
            <button className="refresh-btn" onClick={handleRefresh}>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* NAV SWITCHER – Dashboard + Master Checklist */}
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
          📋 Master Checklist
        </button>
      </div>

      {/* DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <SavingsTracker 
            savings={savings} 
            setSavings={setSavings} 
            currency={currency} 
          />
          
          {/* Month Tabs for filtering bills */}
          <div className="month-tab-row">
            <button 
              className={`month-tab-btn ${selectedList === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedList('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`month-tab-btn ${selectedList === 'quarterly' ? 'active' : ''}`}
              onClick={() => setSelectedList('quarterly')}
            >
              Quarterly
            </button>
            <button 
              className={`month-tab-btn ${selectedList === 'yearly' ? 'active' : ''}`}
              onClick={() => setSelectedList('yearly')}
            >
              Yearly
            </button>
          </div>

          <BillForm 
            onAddBill={handleAddBill} 
            currency={currency} 
          />
          
          <BillList 
            bills={bills} 
            onDeleteBill={handleDeleteBill} 
            onMarkPaid={handleMarkPaid} 
            currency={currency} 
            selectedList={selectedList}
          />
        </div>
      )}

      {/* MASTER CHECKLIST VIEW */}
      {activeTab === 'checklist' && (
        <div className="history-section">
          <h3 className="list-title">📋 Master Checklist</h3>
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
                // Determine which year cycle this bill belongs to based on its current due date
                const dateStr = bill.dueDate || bill.lastPaid || '2026-01-01';
                const [yStr, mStr] = dateStr.split('-');
                const dueYear = parseInt(yStr, 10);
                const dueMonth = parseInt(mStr, 10);

                return (
                  <div key={bill.id} className="checklist-card">
                    <div className="card-top-info">
                      <div className="card-info-left">
                        <strong className="cl-name">{bill.name}</strong>
                        <span className="cl-amount">
                          {currency}{bill.amount.toFixed(2)} — <span className="cl-freq">{bill.frequency}</span>
                        </span>
                      </div>
                      <span className="year-badge">{dueYear} Cycle</span>
                    </div>

                    <div className="month-grid">
                      {MONTHS.map((m, index) => {
                        const monthNumber = index + 1;
                        let statusClass = 'chip-unpaid';
                        let label = m;

                        // Logic: If month number is less than the current due month, it's paid in this cycle
                        // If it equals the due month, it's currently due
                        // If it is greater, it is unpaid
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
    </div>
  );
}

export default App;
