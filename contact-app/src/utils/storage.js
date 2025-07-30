import { STORAGE_KEYS } from './constants';

// Generic storage functions
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Contact-specific storage functions
export const contactStorage = {
  getContacts: () => storage.get(STORAGE_KEYS.CONTACTS, []),
  
  setContacts: (contacts) => storage.set(STORAGE_KEYS.CONTACTS, contacts),
  
  addContact: (contact) => {
    const contacts = contactStorage.getContacts();
    contacts.push(contact);
    return contactStorage.setContacts(contacts);
  },
  
  updateContact: (updatedContact) => {
    const contacts = contactStorage.getContacts();
    const index = contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      contacts[index] = updatedContact;
      return contactStorage.setContacts(contacts);
    }
    return false;
  },
  
  deleteContact: (id) => {
    const contacts = contactStorage.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    return contactStorage.setContacts(filtered);
  },
  
  getContactById: (id) => {
    const contacts = contactStorage.getContacts();
    return contacts.find(c => c.id === id) || null;
  }
};

// Favorites storage
export const favoritesStorage = {
  getFavorites: () => storage.get(STORAGE_KEYS.FAVORITES, []),
  
  setFavorites: (favorites) => storage.set(STORAGE_KEYS.FAVORITES, favorites),
  
  addToFavorites: (contactId) => {
    const favorites = favoritesStorage.getFavorites();
    if (!favorites.includes(contactId)) {
      favorites.push(contactId);
      return favoritesStorage.setFavorites(favorites);
    }
    return true;
  },
  
  removeFromFavorites: (contactId) => {
    const favorites = favoritesStorage.getFavorites();
    const filtered = favorites.filter(id => id !== contactId);
    return favoritesStorage.setFavorites(filtered);
  },
  
  isFavorite: (contactId) => {
    const favorites = favoritesStorage.getFavorites();
    return favorites.includes(contactId);
  }
};

// Theme storage
export const themeStorage = {
  getTheme: () => storage.get(STORAGE_KEYS.THEME, 'light'),
  
  setTheme: (theme) => storage.set(STORAGE_KEYS.THEME, theme),
  
  toggleTheme: () => {
    const currentTheme = themeStorage.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    return themeStorage.setTheme(newTheme);
  }
};

// Settings storage
export const settingsStorage = {
  getSettings: () => storage.get(STORAGE_KEYS.SETTINGS, {
    pageSize: 10,
    sortBy: 'name-asc',
    showFavoritesOnly: false,
    defaultCategory: 'other'
  }),
  
  setSettings: (settings) => storage.set(STORAGE_KEYS.SETTINGS, settings),
  
  updateSetting: (key, value) => {
    const settings = settingsStorage.getSettings();
    settings[key] = value;
    return settingsStorage.setSettings(settings);
  }
};

// Export/Import functions
export const exportContacts = () => {
  const contacts = contactStorage.getContacts();
  const dataStr = JSON.stringify(contacts, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const importContacts = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const contacts = JSON.parse(e.target.result);
        if (Array.isArray(contacts)) {
          contactStorage.setContacts(contacts);
          resolve(contacts);
        } else {
          reject(new Error('Invalid file format: expected an array of contacts'));
        }
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}; 