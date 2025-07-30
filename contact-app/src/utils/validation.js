import { VALIDATION_PATTERNS } from './constants';

// Validation functions
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  if (!VALIDATION_PATTERNS.PHONE.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateUrl = (url) => {
  if (!url) return null; // URL is optional
  if (!VALIDATION_PATTERNS.URL.test(url)) {
    return 'Please enter a valid URL';
  }
  return null;
};

export const validateContact = (contact) => {
  const errors = {};

  // Required fields
  const nameError = validateRequired(contact.name, 'Name');
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(contact.email);
  if (emailError) errors.email = emailError;

  // Optional fields
  const phoneError = validatePhone(contact.phone);
  if (phoneError) errors.phone = phoneError;

  const urlError = validateUrl(contact.website);
  if (urlError) errors.website = urlError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format validation
export const formatPhoneNumber = (phone) => {
  if (!phone) return phone;
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatEmail = (email) => {
  return email.toLowerCase().trim();
};

// Search validation
export const validateSearchTerm = (term) => {
  if (!term || term.trim().length < 2) {
    return 'Search term must be at least 2 characters long';
  }
  return null;
}; 