import React from 'react';
import { Star, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ContactCard from './ContactCard';
import './Favorites.css';

const Favorites = () => {
  const { contacts, favorites } = useApp();

  // Filter contacts to show only favorites
  const favoriteContacts = contacts.allContacts.filter(contact => 
    favorites.isFavorite(contact.id)
  );

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      favorites.clearFavorites();
    }
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          Back to Contacts
        </Link>
        <div className="favorites-title">
          <h1>Favorite Contacts</h1>
          <p>{favoriteContacts.length} favorite contacts</p>
        </div>
      </div>

      {favoriteContacts.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">
            <Star size={64} />
          </div>
          <h3>No favorite contacts yet</h3>
          <p>Start adding contacts to your favorites to see them here</p>
          <Link to="/" className="btn btn-primary">
            <Users size={20} />
            Browse Contacts
          </Link>
        </div>
      ) : (
        <>
          <div className="favorites-actions">
            <div className="favorites-info">
              <Star size={20} />
              <span>{favoriteContacts.length} favorite contacts</span>
            </div>
            <button 
              className="clear-favorites-btn"
              onClick={handleClearFavorites}
            >
              Clear All Favorites
            </button>
          </div>

          <div className="favorites-grid">
            {favoriteContacts.map(contact => (
              <ContactCard 
                key={contact.id} 
                contact={contact}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites; 