import { format, differenceInDays, parseISO } from 'date-fns';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS, CATEGORY_EMOJI, CATEGORY_BG } from './constants';

// ── Date Helpers ──────────────────────────────────────────────────────────────
export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'dd MMM yyyy'); }
  catch { return date; }
};

export const formatDateRange = (start, end) => {
  if (!start || !end) return '—';
  return `${formatDate(start)} → ${formatDate(end)}`;
};

export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  try {
    const diff = differenceInDays(parseISO(end), parseISO(start));
    return Math.max(diff + 1, 1);
  } catch { return 1; }
};

export const todayISO = () => new Date().toISOString().split('T')[0];

export const minBookingDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// ── Currency ──────────────────────────────────────────────────────────────────
export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// ── Booking Status ────────────────────────────────────────────────────────────
export const getStatusBadgeClass = (status) =>
  BOOKING_STATUS_COLORS[status] || 'badge-gray';

export const getStatusLabel = (status) =>
  BOOKING_STATUS_LABELS[status] || status;

// ── Equipment Helpers ─────────────────────────────────────────────────────────
export const getEquipmentEmoji = (category) =>
  CATEGORY_EMOJI[category] || '🔧';

export const getEquipmentBg = (category) =>
  CATEGORY_BG[category] || CATEGORY_BG['Other'];

// ── User Helpers ──────────────────────────────────────────────────────────────
export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export const getRoleBadge = (role) => {
  const map = { farmer: 'badge-green', owner: 'badge-blue', admin: 'badge-dark' };
  return map[role] || 'badge-gray';
};

// ── Validation ────────────────────────────────────────────────────────────────
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone);

// ── String Helpers ────────────────────────────────────────────────────────────
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncate = (str = '', len = 80) =>
  str.length > len ? str.slice(0, len) + '…' : str;

// ── Local Storage ─────────────────────────────────────────────────────────────
export const getLS = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
};

export const setLS = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* ignore */ }
};

export const removeLS = (key) => {
  try { localStorage.removeItem(key); }
  catch { /* ignore */ }
};

// ── Debounce ──────────────────────────────────────────────────────────────────
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ── Filter & Sort ─────────────────────────────────────────────────────────────
export const filterEquipment = (items, { search = '', category = '', available }) => {
  return items.filter(eq => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      eq.name.toLowerCase().includes(q) ||
      eq.location.toLowerCase().includes(q) ||
      eq.category.toLowerCase().includes(q);
    const matchCategory  = !category || eq.category === category;
    const matchAvailable = available === undefined || available === '' || eq.available === available;
    return matchSearch && matchCategory && matchAvailable;
  });
};

export const sortEquipment = (items, sortBy) => {
  const sorted = [...items];
  switch (sortBy) {
    case 'price_asc':  return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case 'price_desc': return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case 'name':       return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:           return sorted;
  }
};
