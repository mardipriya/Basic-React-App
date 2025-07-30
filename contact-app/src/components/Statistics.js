import React from 'react';
import { 
  Users, 
  Star, 
  Building, 
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_CATEGORIES } from '../utils/constants';
import './Statistics.css';

const Statistics = () => {
  const { contacts, favorites } = useApp();
  const { statistics } = contacts;

  const getCategoryColor = (categoryId) => {
    const category = CONTACT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  const getCategoryLabel = (categoryId) => {
    const category = CONTACT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.label : 'Other';
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getRecentContacts = () => {
    return contacts.allContacts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getContactsByMonth = () => {
    const months = {};
    contacts.allContacts.forEach(contact => {
      const date = new Date(contact.createdAt);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[month] = (months[month] || 0) + 1;
    });
    return months;
  };

  const recentContacts = getRecentContacts();
  const contactsByMonth = getContactsByMonth();

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h1>Contact Statistics</h1>
        <p>Analytics and insights about your contacts</p>
      </div>

      {/* Key metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <h3>{statistics?.total || 0}</h3>
            <p>Total Contacts</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Star size={24} />
          </div>
          <div className="metric-content">
            <h3>{statistics?.favoriteCount || 0}</h3>
            <p>Favorites</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Building size={24} />
          </div>
          <div className="metric-content">
            <h3>{Object.keys(statistics?.byCategory || {}).length}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>{recentContacts.length}</h3>
            <p>Recent (Last 5)</p>
          </div>
        </div>
      </div>

      <div className="statistics-content">
        {/* Category breakdown */}
        <div className="stat-section">
          <h2>Contacts by Category</h2>
          <div className="category-breakdown">
            {statistics?.byCategory && Object.entries(statistics.byCategory).map(([categoryId, count]) => (
              <div key={categoryId} className="category-item">
                <div className="category-info">
                  <div 
                    className="category-color" 
                    style={{ backgroundColor: getCategoryColor(categoryId) }}
                  />
                  <span className="category-name">{getCategoryLabel(categoryId)}</span>
                  <span className="category-count">{count}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{ 
                      width: `${calculatePercentage(count, statistics.total)}%`,
                      backgroundColor: getCategoryColor(categoryId)
                    }}
                  />
                </div>
                <span className="category-percentage">
                  {calculatePercentage(count, statistics.total)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="stat-section">
          <h2>Recent Contacts</h2>
          <div className="recent-contacts">
            {recentContacts.length > 0 ? (
              recentContacts.map(contact => (
                <div key={contact.id} className="recent-contact">
                  <div className="contact-avatar">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p>{contact.email}</p>
                    <span className="contact-date">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {favorites.isFavorite(contact.id) && (
                    <div className="favorite-indicator">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No contacts yet</p>
            )}
          </div>
        </div>

        {/* Monthly growth */}
        <div className="stat-section">
          <h2>Monthly Growth</h2>
          <div className="monthly-chart">
            {Object.keys(contactsByMonth).length > 0 ? (
              <div className="chart-container">
                {Object.entries(contactsByMonth).map(([month, count]) => (
                  <div key={month} className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${Math.max((count / Math.max(...Object.values(contactsByMonth))) * 100, 10)}%`
                      }}
                    />
                    <span className="bar-label">{month}</span>
                    <span className="bar-value">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="stat-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn">
              <Users size={20} />
              View All Contacts
            </button>
            <button className="action-btn">
              <Star size={20} />
              View Favorites
            </button>
            <button className="action-btn">
              <Building size={20} />
              Add New Contact
            </button>
            <button className="action-btn">
              <Activity size={20} />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 