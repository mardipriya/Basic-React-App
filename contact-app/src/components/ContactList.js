import React, { useState } from 'react';
import { 
  Grid3X3, 
  List, 
  Filter, 
  SortAsc, 
  Search,
  Users,
  Star,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ContactCard from './ContactCard';
import { CONTACT_CATEGORIES, SORT_OPTIONS, SEARCH_FILTERS } from '../utils/constants';
import { exportContacts, importContacts } from '../utils/storage';
import './ContactList.css';

const ContactList = () => {
  const { 
    contacts, 
    favorites, 
    addNotification,
    updateSetting 
  } = useApp();
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [importFile, setImportFile] = useState(null);

  const handleViewModeToggle = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    updateSetting('viewMode', newMode);
  };

  const handleSortChange = (e) => {
    contacts.sortContacts(e.target.value);
    updateSetting('sortBy', e.target.value);
  };

  const handleCategoryFilter = (category) => {
    contacts.filterByCategory(category);
  };

  const handleFavoritesFilter = () => {
    contacts.toggleFavoritesFilter();
  };

  const handleSearchFilter = (filter) => {
    contacts.searchContacts(contacts.searchTerm, filter);
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.contacts.map(c => c.id));
    }
  };

  const handleContactSelect = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      addNotification({
        type: 'warning',
        message: 'Please select contacts to delete'
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      // This would be implemented with the actual delete functionality
      addNotification({
        type: 'info',
        message: `Bulk delete for ${selectedContacts.length} contacts will be implemented`
      });
      setSelectedContacts([]);
    }
  };

  const handleExport = () => {
    try {
      exportContacts();
      addNotification({
        type: 'success',
        message: 'Contacts exported successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to export contacts'
      });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importContacts(file);
      addNotification({
        type: 'success',
        message: 'Contacts imported successfully'
      });
      contacts.fetchContacts(); // Refresh the list
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to import contacts'
      });
    }
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <Users size={64} />
      <h3>No contacts found</h3>
      <p>
        {contacts.searchTerm 
          ? `No contacts match "${contacts.searchTerm}"`
          : 'Get started by adding your first contact'
        }
      </p>
      {!contacts.searchTerm && (
        <button className="add-first-contact-btn">
          Add Contact
        </button>
      )}
    </div>
  );

  const renderContactGrid = () => (
    <div className={`contacts-grid ${viewMode}`}>
      {contacts.contacts.map(contact => (
        <ContactCard 
          key={contact.id} 
          contact={contact}
        />
      ))}
    </div>
  );

  return (
    <div className="contact-list-container">
      {/* Header with stats and actions */}
      <div className="list-header">
        <div className="list-stats">
          <h2>Contacts</h2>
          <div className="stats-info">
            <span>{contacts.statistics?.total || 0} total</span>
            {contacts.statistics?.favoriteCount > 0 && (
              <span>{contacts.statistics.favoriteCount} favorites</span>
            )}
            {contacts.searchTerm && (
              <span>{contacts.statistics?.searchResults || 0} results</span>
            )}
          </div>
        </div>

        <div className="list-actions">
          {/* View mode toggle */}
          <button 
            className="view-mode-btn"
            onClick={handleViewModeToggle}
            aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid3X3 size={20} />}
          </button>

          {/* Filter toggle */}
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <Filter size={20} />
          </button>

          {/* Import/Export */}
          <div className="import-export">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file" className="import-btn">
              <Upload size={20} />
            </label>
            <button className="export-btn" onClick={handleExport}>
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Search in:</label>
            <select 
              value={contacts.searchFilter} 
              onChange={(e) => handleSearchFilter(e.target.value)}
            >
              <option value={SEARCH_FILTERS.ALL}>All fields</option>
              <option value={SEARCH_FILTERS.NAME}>Name only</option>
              <option value={SEARCH_FILTERS.EMAIL}>Email only</option>
              <option value={SEARCH_FILTERS.PHONE}>Phone only</option>
              <option value={SEARCH_FILTERS.COMPANY}>Company only</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={contacts.sortBy} onChange={handleSortChange}>
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select onChange={(e) => handleCategoryFilter(e.target.value)}>
              <option value="all">All categories</option>
              {CONTACT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={contacts.showFavoritesOnly}
                onChange={handleFavoritesFilter}
              />
              <Star size={16} />
              Favorites only
            </label>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selectedContacts.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedContacts.length} selected</span>
          <button 
            className="bulk-delete-btn"
            onClick={handleBulkDelete}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Loading state */}
      {contacts.loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading contacts...</p>
        </div>
      )}

      {/* Error state */}
      {contacts.error && (
        <div className="error-state">
          <p>Error: {contacts.error}</p>
          <button onClick={contacts.fetchContacts}>
            Try Again
          </button>
        </div>
      )}

      {/* Contact list/grid */}
      {!contacts.loading && !contacts.error && (
        <>
          {contacts.contacts.length === 0 ? (
            renderEmptyState()
          ) : (
            renderContactGrid()
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;