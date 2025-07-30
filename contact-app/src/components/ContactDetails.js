import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Calendar, 
  Globe, 
  Star,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_CATEGORIES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/validation';
import './ContactDetails.css';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { contacts, favorites, addNotification } = useApp();

  // Get contact from location state or find by ID
  const contact = location.state?.contact || contacts.getContactById(id);

  if (!contact) {
    return (
      <div className="contact-details-container">
        <div className="not-found">
          <h2>Contact Not Found</h2>
          <p>The contact you're looking for doesn't exist.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    company,
    jobTitle,
    address,
    website,
    birthday,
    category,
    notes,
    createdAt,
    updatedAt
  } = contact;

  const getCategoryInfo = () => {
    return CONTACT_CATEGORIES.find(cat => cat.id === category) || CONTACT_CATEGORIES[4];
  };

  const categoryInfo = getCategoryInfo();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const handleEdit = () => {
    navigate('/edit', { state: { contact } });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const result = await contacts.deleteContact(id);
      if (result.success) {
        addNotification({
          type: 'success',
          message: `${name} has been deleted`
        });
        navigate('/');
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to delete contact'
        });
      }
    }
  };

  const handleFavoriteToggle = () => {
    const result = favorites.toggleFavorite(id);
    if (result.success) {
      addNotification({
        type: 'success',
        message: favorites.isFavorite(id) 
          ? `${name} added to favorites` 
          : `${name} removed from favorites`
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="contact-details-container">
      <div className="contact-details-header">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Contacts
        </button>
        
        <div className="header-actions">
          <button 
            className={`favorite-btn ${favorites.isFavorite(id) ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={favorites.isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={20} fill={favorites.isFavorite(id) ? 'currentColor' : 'none'} />
          </button>
          
          <button className="edit-btn" onClick={handleEdit}>
            <Edit size={20} />
            Edit
          </button>
          
          <button className="delete-btn" onClick={handleDelete}>
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="contact-details-content">
        <div className="contact-profile">
          <div 
            className="contact-avatar"
            style={{ backgroundColor: categoryInfo.color }}
          >
            {getInitials(name)}
          </div>
          
          <div className="contact-info">
            <h1>{name}</h1>
            {jobTitle && company && (
              <p className="job-title">{jobTitle} at {company}</p>
            )}
            <div 
              className="category-badge"
              style={{ backgroundColor: categoryInfo.color }}
            >
              {categoryInfo.label}
            </div>
          </div>
        </div>

        <div className="contact-details-grid">
          {/* Contact Information */}
          <div className="details-section">
            <h2>Contact Information</h2>
            <div className="details-list">
              {email && (
                <div className="detail-item">
                  <Mail size={20} />
                  <div className="detail-content">
                    <label>Email</label>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>
              )}
              
              {phone && (
                <div className="detail-item">
                  <Phone size={20} />
                  <div className="detail-content">
                    <label>Phone</label>
                    <a href={`tel:${phone}`}>{formatPhoneNumber(phone)}</a>
                  </div>
                </div>
              )}
              
              {website && (
                <div className="detail-item">
                  <Globe size={20} />
                  <div className="detail-content">
                    <label>Website</label>
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="details-section">
            <h2>Professional Information</h2>
            <div className="details-list">
              {company && (
                <div className="detail-item">
                  <Building size={20} />
                  <div className="detail-content">
                    <label>Company</label>
                    <span>{company}</span>
                  </div>
                </div>
              )}
              
              {jobTitle && (
                <div className="detail-item">
                  <User size={20} />
                  <div className="detail-content">
                    <label>Job Title</label>
                    <span>{jobTitle}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="details-section">
            <h2>Personal Information</h2>
            <div className="details-list">
              {birthday && (
                <div className="detail-item">
                  <Calendar size={20} />
                  <div className="detail-content">
                    <label>Birthday</label>
                    <span>{formatDate(birthday)}</span>
                  </div>
                </div>
              )}
              
              {address && (
                <div className="detail-item">
                  <MapPin size={20} />
                  <div className="detail-content">
                    <label>Address</label>
                    <span>{address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="details-section full-width">
              <h2>Notes</h2>
              <div className="notes-content">
                <p>{notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="details-section full-width">
            <h2>Contact Details</h2>
            <div className="metadata">
              <div className="metadata-item">
                <label>Created</label>
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="metadata-item">
                <label>Last Updated</label>
                <span>{formatDate(updatedAt)}</span>
              </div>
              <div className="metadata-item">
                <label>Contact ID</label>
                <span className="contact-id">{id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
