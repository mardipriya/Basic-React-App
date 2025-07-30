import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  MapPin,
  Calendar,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_CATEGORIES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/validation';
import './ContactCard.css';

const ContactCard = ({ contact }) => {
  const { favorites, addNotification } = useApp();
  const { id, name, email, phone, company, jobTitle, address, website, birthday, category } = contact;

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = favorites.toggleFavorite(id);
    if (result.success) {
      addNotification({
        type: favorites.isFavorite(id) ? 'success' : 'info',
        message: favorites.isFavorite(id) 
          ? `${name} added to favorites` 
          : `${name} removed from favorites`
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      // This will be handled by the parent component
      // For now, just show a notification
      addNotification({
        type: 'warning',
        message: 'Delete functionality will be implemented in the parent component'
      });
    }
  };

  const getCategoryInfo = () => {
    return CONTACT_CATEGORIES.find(cat => cat.id === category) || CONTACT_CATEGORIES[4]; // Default to 'other'
  };

  const categoryInfo = getCategoryInfo();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="contact-card">
      <Link to={`/contact/${id}`} className="contact-card-link">
        <div className="contact-card-header">
          <div className="contact-avatar">
            <div 
              className="avatar-initials"
              style={{ backgroundColor: categoryInfo.color }}
            >
              {getInitials(name)}
            </div>
            <div 
              className="category-badge"
              style={{ backgroundColor: categoryInfo.color }}
            >
              {categoryInfo.label}
            </div>
          </div>
          
          <div className="contact-actions">
            <button
              className={`favorite-btn ${favorites.isFavorite(id) ? 'favorited' : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={favorites.isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={16} fill={favorites.isFavorite(id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="contact-card-body">
          <h3 className="contact-name">{name}</h3>
          
          {jobTitle && company && (
            <p className="contact-title">
              <Building size={14} />
              {jobTitle} at {company}
            </p>
          )}
          
          {email && (
            <div className="contact-info">
              <Mail size={14} />
              <span>{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="contact-info">
              <Phone size={14} />
              <span>{formatPhoneNumber(phone)}</span>
            </div>
          )}
          
          {website && (
            <div className="contact-info">
              <Globe size={14} />
              <span className="website-link">{website}</span>
            </div>
          )}
          
          {address && (
            <div className="contact-info">
              <MapPin size={14} />
              <span className="address-text">{address}</span>
            </div>
          )}
          
          {birthday && (
            <div className="contact-info">
              <Calendar size={14} />
              <span>{formatDate(birthday)}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="contact-card-footer">
        <Link 
          to={`/edit`} 
          state={{ contact }}
          className="edit-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit size={16} />
          <span>Edit</span>
        </Link>
        
        <button 
          className="delete-btn"
          onClick={handleDelete}
          aria-label="Delete contact"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
