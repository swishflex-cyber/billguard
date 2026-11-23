import React, { useState, useEffect } from 'react';
import { formatDueDate, isDueSoon } from '../utils/billLogic';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function BillList({ bills, onDeleteBill, onMarkPaid, currency, selectedList }) {
  // Filter by frequency
  const monthly = bills.filter(b => b.frequency === 'monthly');
  const quarterly = bills.filter(b => b.frequency === 'quarterly');
  const yearly = bills.filter(b => b.frequency === 'yearly');

  // For monthly view, add month selector
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month
    const today = new Date();
    return today.getMonth(); // 0-11
  });

  // Pick the correct list based on selectedList prop
  let filteredBills;
  let title;

  if (selectedList === 'monthly') {
    // Filter monthly bills by selected month
    filteredBills = monthly.filter(bill => {
      const dateStr = bill.dueDate || bill.lastPaid || bill.date || '';
      if (!dateStr) return false;
      const billMonth = new Date(dateStr).getMonth();
      return billMonth === selectedMonth;
    });
    title = `📅 Monthly Checklist — ${MONTHS[selectedMonth]}`;
  } else if (selectedList === 'quarterly') {
    filteredBills = quarterly;
    title = '🗓️ Quarterly Checklist';
  } else if (selectedList === 'yearly') {
    filteredBills = yearly;
    title = '🎆 Yearly Checklist';
  } else {
    filteredBills = monthly;
    title = '📅 Monthly Checklist';
  }

  const renderItem = (bill) => {
    const dateStr = bill.dueDate || bill.lastPaid || bill.date || '';
    const soon = isDueSoon(dateStr);
    
    return (
      <div key={bill.id} className={`bill-card-item ${soon ? 'soon' : ''}`}>
        <button className="huge-action-btn delete-bg" onClick={() => onDeleteBill(bill.id)}>
          DEL
        </button>
        
        <div className="bill-details">
          <span className="b-name">{bill.name}</span>
          <span className="b-price">{currency}{bill.amount.toFixed(2)}</span>
          <div className="b-date">
            Due: {dateStr ? formatDueDate(dateStr) : 'No date set'}
          </div>
        </div>

        <button className="huge-action-btn paid-bg" onClick={() => onMarkPaid(bill)}>
          PAID
        </button>
      </div>
    );
  };

  return (
    <div className="bill-list-wrapper">
      <h3 className="list-title">{title}</h3>

      {/* Month tabs for Monthly view */}
      {selectedList === 'monthly' && (
        <div className="month-tab-row">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              className={`month-tab-btn ${selectedMonth === index ? 'active' : ''}`}
              onClick={() => setSelectedMonth(index)}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {filteredBills.length === 0 ? (
        <p className="empty">No {selectedList} bills{selectedList === 'monthly' ? ` for ${MONTHS[selectedMonth]}` : ''}.</p>
      ) : (
        filteredBills.map(renderItem)
      )}
    </div>
  );
}

export default BillList;
