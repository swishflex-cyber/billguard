import { isBefore, addDays } from 'date-fns';

export function advanceDueDate(dateStr, frequency) {
  if (!dateStr) return dateStr;

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (frequency === 'monthly') {
    month += 1;
  } else if (frequency === 'quarterly') {
    month += 3;
  } else if (frequency === 'yearly') {
    year += 1;
  }

  while (month > 12) {
    month -= 12;
    year += 1;
  }

  const maxDaysInMonth = new Date(year, month, 0).getDate();
  const finalDay = Math.min(day, maxDaysInMonth);

  const mStr = String(month).padStart(2, '0');
  const dStr = String(finalDay).padStart(2, '0');

  return `${year}-${mStr}-${dStr}`;
}

export function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function isDueSoon(dateStr, days = 3) {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = addDays(today, days);
  
  return isBefore(dueDate, deadline) || dueDate.getTime() <= today.getTime();
}