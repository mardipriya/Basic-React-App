import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../api/contacts';
import { contactStorage } from '../utils/storage';
import { validateContact } from '../utils/validation';
import { SORT_OPTIONS, SEARCH_FILTERS } from '../utils/constants';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState(SEARCH_FILTERS.ALL);
  const [sortBy, setSortBy] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch contacts from API
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contacts on mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Add new contact
  const addContact = useCallback(async (contactData) => {
    try {
      setError(null);
      
      // Validate contact data
      const validation = validateContact(contactData);
      if (!validation.isValid) {
        throw new Error('Invalid contact data');
      }

      const newContact = {
        id: uuidv4(),
        ...contactData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post('/contacts', newContact);
      setContacts(prev => [...prev, response.data]);
      
      return { success: true, contact: response.data };
    } catch (err) {
      setError(err.message || 'Failed to add contact');
      return { success: false, error: err.message };
    }
  }, []);

  // Update existing contact
  const updateContact = useCallback(async (contactData) => {
    try {
      setError(null);
      
      const validation = validateContact(contactData);
      if (!validation.isValid) {
        throw new Error('Invalid contact data');
      }

      const updatedContact = {
        ...contactData,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put(`/contacts/${contactData.id}`, updatedContact);
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactData.id ? response.data : contact
        )
      );
      
      return { success: true, contact: response.data };
    } catch (err) {
      setError(err.message || 'Failed to update contact');
      return { success: false, error: err.message };
    }
  }, []);

  // Delete contact
  const deleteContact = useCallback(async (id) => {
    try {
      setError(null);
      await api.delete(`/contacts/${id}`);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
      return { success: false, error: err.message };
    }
  }, []);

  // Get contact by ID
  const getContactById = useCallback((id) => {
    return contacts.find(contact => contact.id === id) || null;
  }, [contacts]);

  // Search contacts
  const searchContacts = useCallback((term, filter = SEARCH_FILTERS.ALL) => {
    setSearchTerm(term);
    setSearchFilter(filter);
  }, []);

  // Sort contacts
  const sortContacts = useCallback((sortOption) => {
    setSortBy(sortOption);
  }, []);

  // Filter by category
  const filterByCategory = useCallback((category) => {
    setCategoryFilter(category);
  }, []);

  // Toggle favorites filter
  const toggleFavoritesFilter = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact => {
        const searchLower = searchTerm.toLowerCase();
        
        switch (searchFilter) {
          case SEARCH_FILTERS.NAME:
            return contact.name?.toLowerCase().includes(searchLower);
          case SEARCH_FILTERS.EMAIL:
            return contact.email?.toLowerCase().includes(searchLower);
          case SEARCH_FILTERS.PHONE:
            return contact.phone?.toLowerCase().includes(searchLower);
          case SEARCH_FILTERS.COMPANY:
            return contact.company?.toLowerCase().includes(searchLower);
          default:
            return Object.values(contact).some(value => 
              value?.toString().toLowerCase().includes(searchLower)
            );
        }
      });
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(contact => contact.category === categoryFilter);
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      filtered = filtered.filter(contact => favorites.includes(contact.id));
    }

    return filtered;
  }, [contacts, searchTerm, searchFilter, categoryFilter, showFavoritesOnly]);

  // Sorted contacts
  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'email-asc':
        return sorted.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
      case 'email-desc':
        return sorted.sort((a, b) => (b.email || '').localeCompare(a.email || ''));
      case 'created-asc':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'created-desc':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  }, [filteredContacts, sortBy]);

  // Statistics
  const statistics = useMemo(() => {
    const total = contacts.length;
    const byCategory = contacts.reduce((acc, contact) => {
      const category = contact.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteCount = favorites.length;

    return {
      total,
      byCategory,
      favoriteCount,
      searchResults: filteredContacts.length
    };
  }, [contacts, filteredContacts]);

  return {
    // State
    contacts: sortedContacts,
    allContacts: contacts,
    loading,
    error,
    searchTerm,
    searchFilter,
    sortBy,
    categoryFilter,
    showFavoritesOnly,
    
    // Actions
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    getContactById,
    searchContacts,
    sortContacts,
    filterByCategory,
    toggleFavoritesFilter,
    
    // Computed
    statistics
  };
}; 