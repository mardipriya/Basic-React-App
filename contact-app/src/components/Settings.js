import React from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  Palette,
  Bell,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PAGINATION, SORT_OPTIONS } from '../utils/constants';
import { exportContacts, importContacts } from '../utils/storage';
import './Settings.css';

const Settings = () => {
  const { 
    settings, 
    updateSetting, 
    theme, 
    addNotification,
    contacts 
  } = useApp();

  const handleThemeChange = (newTheme) => {
    theme.changeTheme(newTheme);
    addNotification({
      type: 'success',
      message: `Theme changed to ${newTheme} mode`
    });
  };

  const handleSettingChange = (key, value) => {
    updateSetting(key, value);
    addNotification({
      type: 'success',
      message: 'Setting updated successfully'
    });
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
      contacts.fetchContacts();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to import contacts'
      });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      addNotification({
        type: 'success',
        message: 'All data cleared successfully'
      });
      window.location.reload();
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          Back to Contacts
        </Link>
        <div className="settings-title">
          <h1>Settings</h1>
          <p>Manage your application preferences</p>
        </div>
      </div>

      <div className="settings-content">
        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Palette size={20} />
            <h2>Appearance</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <p>Choose your preferred color scheme</p>
              </div>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${theme.isLight() ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun size={16} />
                  Light
                </button>
                <button
                  className={`theme-btn ${theme.isDark() ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon size={16} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="settings-section">
          <div className="section-header">
            <SettingsIcon size={20} />
            <h2>Display</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Page Size</label>
                <p>Number of contacts to display per page</p>
              </div>
              <select
                value={settings.pageSize}
                onChange={(e) => handleSettingChange('pageSize', parseInt(e.target.value))}
                className="setting-select"
              >
                {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>
                    {size} contacts
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Default Sort</label>
                <p>Default sorting order for contacts</p>
              </div>
              <select
                value={settings.sortBy}
                onChange={(e) => handleSettingChange('sortBy', e.target.value)}
                className="setting-select"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <div className="section-header">
            <Download size={20} />
            <h2>Data Management</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Export Contacts</label>
                <p>Download your contacts as a JSON file</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleExport}
              >
                <Download size={16} />
                Export
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Import Contacts</label>
                <p>Import contacts from a JSON file</p>
              </div>
              <div className="import-wrapper">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  id="import-file"
                  style={{ display: 'none' }}
                />
                <label htmlFor="import-file" className="btn btn-secondary">
                  <Upload size={16} />
                  Import
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Clear All Data</label>
                <p>Remove all contacts and settings (cannot be undone)</p>
              </div>
              <button 
                className="btn btn-danger"
                onClick={handleClearData}
              >
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Show Notifications</label>
                <p>Display toast notifications for actions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-section">
          <div className="section-header">
            <Shield size={20} />
            <h2>Privacy & Security</h2>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label>Data Storage</label>
                <p>Your data is stored locally in your browser</p>
              </div>
              <span className="setting-status">Local Storage</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <div className="section-header">
            <SettingsIcon size={20} />
            <h2>About</h2>
          </div>
          <div className="settings-group">
            <div className="about-info">
              <h3>ContactHub</h3>
              <p>Version 1.0.0</p>
              <p>A modern contact management application built with React</p>
              <div className="about-features">
                <span>• Contact Management</span>
                <span>• Categories & Favorites</span>
                <span>• Import/Export</span>
                <span>• Dark/Light Theme</span>
                <span>• Responsive Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 