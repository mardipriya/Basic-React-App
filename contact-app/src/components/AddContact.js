import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Globe, 
  FileText,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_FIELDS, CONTACT_CATEGORIES } from '../utils/constants';
import { validateContact } from '../utils/validation';
import './AddContact.css';

const AddContact = () => {
  const navigate = useNavigate();
  const { contacts, addNotification } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      address: '',
      website: '',
      birthday: '',
      category: 'other',
      notes: ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Validate the contact data
      const validation = validateContact(data);
      if (!validation.isValid) {
        addNotification({
          type: 'error',
          message: 'Please fix the validation errors'
        });
        return;
      }

      const result = await contacts.addContact(data);
      
      if (result.success) {
        addNotification({
          type: 'success',
          message: `${data.name} has been added successfully`
        });
        reset();
        navigate('/');
      } else {
        addNotification({
          type: 'error',
          message: result.error || 'Failed to add contact'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const renderField = (fieldName, fieldConfig) => {
    const IconComponent = {
      name: User,
      email: Mail,
      phone: Phone,
      company: Building,
      jobTitle: Building,
      address: MapPin,
      website: Globe,
      birthday: Calendar,
      notes: FileText
    }[fieldName];

    const Icon = IconComponent || User;

    if (fieldConfig.type === 'textarea') {
      return (
        <div key={fieldName} className="form-group">
          <label htmlFor={fieldName} className="form-label">
            <Icon size={16} />
            {fieldConfig.label}
            {fieldConfig.required && <span className="required">*</span>}
          </label>
          <textarea
            id={fieldName}
            {...register(fieldName, {
              required: fieldConfig.required ? `${fieldConfig.label} is required` : false
            })}
            className={`form-control ${errors[fieldName] ? 'error' : ''}`}
            placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
            rows={3}
          />
          {errors[fieldName] && (
            <span className="error-message">{errors[fieldName].message}</span>
          )}
        </div>
      );
    }

    if (fieldConfig.type === 'select') {
      return (
        <div key={fieldName} className="form-group">
          <label htmlFor={fieldName} className="form-label">
            <Icon size={16} />
            {fieldConfig.label}
            {fieldConfig.required && <span className="required">*</span>}
          </label>
          <select
            id={fieldName}
            {...register(fieldName, {
              required: fieldConfig.required ? `${fieldConfig.label} is required` : false
            })}
            className={`form-control ${errors[fieldName] ? 'error' : ''}`}
          >
            <option value="">Select a category</option>
            {CONTACT_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          {errors[fieldName] && (
            <span className="error-message">{errors[fieldName].message}</span>
          )}
        </div>
      );
    }

    return (
      <div key={fieldName} className="form-group">
        <label htmlFor={fieldName} className="form-label">
          <Icon size={16} />
          {fieldConfig.label}
          {fieldConfig.required && <span className="required">*</span>}
        </label>
        <input
          id={fieldName}
          type={fieldConfig.type}
          {...register(fieldName, {
            required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
            pattern: fieldConfig.type === 'email' ? {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address'
            } : undefined
          })}
          className={`form-control ${errors[fieldName] ? 'error' : ''}`}
          placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
        />
        {errors[fieldName] && (
          <span className="error-message">{errors[fieldName].message}</span>
        )}
      </div>
    );
  };

  return (
    <div className="add-contact-container">
      <div className="add-contact-header">
        <button className="back-btn" onClick={handleCancel}>
          <ArrowLeft size={20} />
          Back to Contacts
        </button>
        <h1>Add New Contact</h1>
      </div>

      <div className="add-contact-content">
        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
          <div className="form-grid">
            {/* Required fields section */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-fields">
                {renderField('name', CONTACT_FIELDS.name)}
                {renderField('email', CONTACT_FIELDS.email)}
                {renderField('phone', CONTACT_FIELDS.phone)}
              </div>
            </div>

            {/* Professional information */}
            <div className="form-section">
              <h3>Professional Information</h3>
              <div className="form-fields">
                {renderField('company', CONTACT_FIELDS.company)}
                {renderField('jobTitle', CONTACT_FIELDS.jobTitle)}
                {renderField('category', CONTACT_FIELDS.category)}
              </div>
            </div>

            {/* Additional information */}
            <div className="form-section full-width">
              <h3>Additional Information</h3>
              <div className="form-fields">
                {renderField('address', CONTACT_FIELDS.address)}
                {renderField('website', CONTACT_FIELDS.website)}
                {renderField('birthday', CONTACT_FIELDS.birthday)}
                {renderField('notes', CONTACT_FIELDS.notes)}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={16} />
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>

        {/* Preview card */}
        <div className="contact-preview">
          <h3>Preview</h3>
          <div className="preview-card">
            <div className="preview-avatar">
              {watchedValues.name ? watchedValues.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="preview-info">
              <h4>{watchedValues.name || 'Contact Name'}</h4>
              {watchedValues.jobTitle && watchedValues.company && (
                <p>{watchedValues.jobTitle} at {watchedValues.company}</p>
              )}
              {watchedValues.email && <p>{watchedValues.email}</p>}
              {watchedValues.phone && <p>{watchedValues.phone}</p>}
              {watchedValues.category && (
                <span className="preview-category">
                  {CONTACT_CATEGORIES.find(c => c.id === watchedValues.category)?.label || 'Other'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
