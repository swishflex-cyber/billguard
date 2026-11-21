import React from 'react';
import { formatDueDate, isDueSoon } from '../utils/billLogic';

function BillList({ bills, onDeleteBill, onMarkPaid, currency }) {
  const monthly = bills.filter(b => b.frequency === 'monthly');
  const quarterly = bills.filter(b => b.frequency === 'quarterly');
  const yearly = bills.filter(b => b.frequency === 'yearly');

  const renderItem = (bill) => {
    // Check all possible variable names to find the date
    const dateStr = bill.dueDate || bill.lastPaid || bill.date || '';
    const soon = isDueSoon(dateStr);
    
    return (
      <div key={bill.id} className={`bill-card-item ${soon ? 'soon' : ''}`}>
        {/* HUGE RED DELETE BUTTON (Left) */}
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

        {/* HUGE GREEN PAID BUTTON (Right) */}
        <button className="huge-action-btn paid-bg" onClick={() => onMarkPaid(bill)}>
          PAID
        </button>
      </div>
    );
  };

  return (
    <div className="bill-list-wrapper">
      <h3 className="list-title">📅 Monthly Checklist</h3>
      {monthly.length === 0 ? <p className="empty">No monthly bills.</p> : monthly.map(renderItem)}
      
      <h3 className="list-title mt">🗓️ Quarterly Checklist</h3>
      {quarterly.length === 0 ? <p className="empty">No quarterly bills.</p> : quarterly.map(renderItem)}

      <h3 className="list-title mt">🎆 Yearly Checklist</h3>
      {yearly.length === 0 ? <p className="empty">No yearly bills.</p> : yearly.map(renderItem)}
    </div>
  );
}

export default BillList;