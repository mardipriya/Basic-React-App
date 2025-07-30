# ContactHub - Modern Contact Management Application

A feature-rich, modern contact management application built with React, featuring a modular architecture, dark/light themes, and comprehensive contact management capabilities.

![ContactHub Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=ContactHub+Demo)

## ✨ Features

### 🎯 Core Functionality
- **Contact Management**: Full CRUD operations for contacts
- **Advanced Search**: Search across all contact fields with filters
- **Categories & Tags**: Organize contacts by categories (Family, Work, Friends, Business, Other)
- **Favorites System**: Mark and manage favorite contacts
- **Import/Export**: Backup and restore contacts via JSON files

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Preview**: Live preview when adding/editing contacts
- **Toast Notifications**: User-friendly feedback for all actions

### 📊 Analytics & Insights
- **Contact Statistics**: View contact analytics and insights
- **Category Breakdown**: Visual representation of contact distribution
- **Recent Contacts**: Track recently added contacts
- **Monthly Growth**: Chart showing contact growth over time

### 🔧 Advanced Features
- **Form Validation**: Comprehensive validation with error handling
- **Bulk Operations**: Select and manage multiple contacts
- **Sorting Options**: Sort by name, email, creation date
- **Filtering**: Filter by category, favorites, and search terms
- **Local Storage**: Persistent data storage with error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contact-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Start the JSON server (in a separate terminal)**
   ```bash
   cd ../server-api
   npm install
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
contact-app/
├── src/
│   ├── components/          # React components
│   │   ├── Header.js       # Navigation header
│   │   ├── ContactList.js  # Main contact list
│   │   ├── ContactCard.js  # Individual contact card
│   │   ├── AddContact.js   # Add contact form
│   │   ├── EditContact.js  # Edit contact form
│   │   ├── ContactDetails.js # Contact detail view
│   │   ├── Statistics.js   # Analytics dashboard
│   │   ├── Favorites.js    # Favorites management
│   │   ├── Settings.js     # Application settings
│   │   └── *.css          # Component styles
│   ├── hooks/              # Custom React hooks
│   │   ├── useContacts.js  # Contact management logic
│   │   ├── useFavorites.js # Favorites management
│   │   └── useTheme.js     # Theme management
│   ├── context/            # React context
│   │   └── AppContext.js   # Global state management
│   ├── utils/              # Utility functions
│   │   ├── constants.js    # Application constants
│   │   ├── validation.js   # Form validation
│   │   └── storage.js      # Local storage utilities
│   ├── api/                # API configuration
│   │   └── contacts.js     # Axios configuration
│   └── index.js           # Application entry point
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **React Hook Form**: Form management and validation
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications

### Styling
- **CSS3**: Custom CSS with CSS variables for theming
- **Responsive Design**: Mobile-first approach
- **CSS Grid & Flexbox**: Modern layout techniques

### State Management
- **React Context**: Global state management
- **Custom Hooks**: Reusable state logic
- **Local Storage**: Persistent data storage

### Development Tools
- **Create React App**: Development environment
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 📱 Features in Detail

### Contact Management
- **Add Contacts**: Comprehensive form with validation
- **Edit Contacts**: In-place editing with real-time updates
- **Delete Contacts**: Safe deletion with confirmation
- **View Details**: Detailed contact information display

### Search & Filter
- **Global Search**: Search across all contact fields
- **Field-specific Search**: Search by name, email, phone, or company
- **Category Filter**: Filter contacts by category
- **Favorites Filter**: Show only favorite contacts
- **Sort Options**: Multiple sorting criteria

### Data Management
- **Export**: Download contacts as JSON file
- **Import**: Import contacts from JSON file
- **Backup**: Automatic local storage backup
- **Clear Data**: Option to clear all data

### User Preferences
- **Theme Toggle**: Switch between light and dark themes
- **Page Size**: Configure contacts per page
- **Default Sort**: Set default sorting preference
- **Notifications**: Toggle toast notifications

## 🎨 Theming System

The application supports a comprehensive theming system with CSS variables:

```css
/* Light Theme */
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--text-primary: #1a1a1a;
--text-secondary: #6c757d;
--primary-color: #3b82f6;

/* Dark Theme */
--bg-primary: #1a1a1a;
--bg-secondary: #2a2a2a;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--primary-color: #3b82f6;
```

## 📊 Contact Schema

Each contact includes the following fields:

```javascript
{
  id: "unique-id",
  name: "Full Name",           // Required
  email: "email@example.com",  // Required
  phone: "+1234567890",        // Optional
  company: "Company Name",     // Optional
  jobTitle: "Job Title",       // Optional
  address: "Full Address",     // Optional
  website: "https://website.com", // Optional
  birthday: "1990-01-01",      // Optional
  category: "work",            // Optional
  notes: "Additional notes",   // Optional
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
```

### API Configuration
The application uses JSON Server for the backend. Configure the API endpoint in `src/api/contacts.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Linting
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request
