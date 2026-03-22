// ── API Base URL ──────────────────────────────────────────────────────────────
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = {
  FARMER: 'farmer',
  OWNER:  'owner',
  ADMIN:  'admin',
};

// ── Booking Statuses ──────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_STATUS_LABELS = {
  pending:   'Pending',
  approved:  'Approved',
  rejected:  'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BOOKING_STATUS_COLORS = {
  pending:   'badge-amber',
  approved:  'badge-green',
  rejected:  'badge-red',
  completed: 'badge-blue',
  cancelled: 'badge-gray',
};

// ── Equipment Categories ──────────────────────────────────────────────────────
export const EQUIPMENT_CATEGORIES = [
  'Tractor',
  'Harvester',
  'Tillage',
  'Planting',
  'Sprayer',
  'Irrigation',
  'Processing',
  'Transport',
  'Other',
];

// ── Equipment Category Emojis ─────────────────────────────────────────────────
export const CATEGORY_EMOJI = {
  Tractor:    '🚜',
  Harvester:  '🌾',
  Tillage:    '⚙️',
  Planting:   '🌱',
  Sprayer:    '💧',
  Irrigation: '🚿',
  Processing: '🏭',
  Transport:  '🚛',
  Other:      '🔧',
};

// ── Category Gradient Backgrounds ─────────────────────────────────────────────
export const CATEGORY_BG = {
  Tractor:    'linear-gradient(135deg, #dcfce7, #bbf7d0)',
  Harvester:  'linear-gradient(135deg, #fef3c7, #fde68a)',
  Tillage:    'linear-gradient(135deg, #e5e7eb, #d1d5db)',
  Planting:   'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  Sprayer:    'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  Irrigation: 'linear-gradient(135deg, #cffafe, #a5f3fc)',
  Processing: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  Transport:  'linear-gradient(135deg, #fee2e2, #fecaca)',
  Other:      'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
};

// ── Indian States ─────────────────────────────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGE_SIZE = 9;

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const LS_TOKEN = 'agrishare_token';
export const LS_USER  = 'agrishare_user';
