// Contact categories
export const CONTACT_CATEGORIES = [
  { id: 'family', label: 'Family', color: '#FF6B6B' },
  { id: 'work', label: 'Work', color: '#4ECDC4' },
  { id: 'friends', label: 'Friends', color: '#45B7D1' },
  { id: 'business', label: 'Business', color: '#96CEB4' },
  { id: 'other', label: 'Other', color: '#FFEAA7' }
];

// Contact fields
export const CONTACT_FIELDS = {
  name: { required: true, type: 'text', label: 'Full Name' },
  email: { required: true, type: 'email', label: 'Email Address' },
  phone: { required: false, type: 'tel', label: 'Phone Number' },
  company: { required: false, type: 'text', label: 'Company' },
  jobTitle: { required: false, type: 'text', label: 'Job Title' },
  address: { required: false, type: 'textarea', label: 'Address' },
  notes: { required: false, type: 'textarea', label: 'Notes' },
  category: { required: false, type: 'select', label: 'Category' },
  birthday: { required: false, type: 'date', label: 'Birthday' },
  website: { required: false, type: 'url', label: 'Website' }
};

// Local storage keys
export const STORAGE_KEYS = {
  CONTACTS: 'contacts',
  THEME: 'theme',
  FAVORITES: 'favorites',
  SETTINGS: 'settings'
};

// API endpoints
export const API_ENDPOINTS = {
  CONTACTS: '/contacts',
  CONTACT: (id) => `/contacts/${id}`,
  SEARCH: '/contacts/search'
};

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Search filters
export const SEARCH_FILTERS = {
  ALL: 'all',
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  COMPANY: 'company'
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'email-asc', label: 'Email (A-Z)' },
  { value: 'email-desc', label: 'Email (Z-A)' },
  { value: 'created-asc', label: 'Created (Oldest)' },
  { value: 'created-desc', label: 'Created (Newest)' }
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}; 