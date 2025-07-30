import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Users,
  Star,
  Settings,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_CATEGORIES } from '../utils/constants';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { 
    contacts, 
    theme, 
    sidebarOpen, 
    toggleSidebar, 
    setCurrentView,
    updateSetting 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    contacts.searchContacts(term);
  };

  const handleThemeToggle = () => {
    theme.toggleTheme();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Contacts';
      case '/add':
        return 'Add Contact';
      case '/favorites':
        return 'Favorites';
      case '/statistics':
        return 'Statistics';
      case '/settings':
        return 'Settings';
      default:
        return 'Contacts';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo and title */}
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <Users size={28} />
            <span className="header-title">ContactHub</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className={`header-search ${showSearch ? 'active' : ''}`}>
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              onFocus={() => setShowSearch(true)}
              onBlur={() => setShowSearch(false)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <Users size={20} />
            <span>Contacts</span>
          </Link>
          
          <Link 
            to="/favorites" 
            className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
            onClick={() => setCurrentView('favorites')}
          >
            <Star size={20} />
            <span>Favorites</span>
          </Link>
          
          <Link 
            to="/statistics" 
            className={`nav-link ${isActive('/statistics') ? 'active' : ''}`}
            onClick={() => setCurrentView('statistics')}
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Add contact button */}
          <Link to="/add" className="add-btn">
            <Plus size={20} />
            <span>Add Contact</span>
          </Link>

          {/* Theme toggle */}
          <button 
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {theme.isDark() ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Settings */}
          <Link to="/settings" className="settings-btn">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Page title for mobile */}
      <div className="page-title-mobile">
        <h1>{getPageTitle()}</h1>
        {contacts.statistics && (
          <span className="contact-count">
            {contacts.statistics.total} contacts
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
