import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '../context/AppContext';
import Header from './Header';
import ContactList from './ContactList';
import AddContact from './AddContact';
import ContactDetails from './ContactDetails';
import EditContact from './EditContact';
import Statistics from './Statistics';
import Settings from './Settings';
import Favorites from './Favorites';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ContactList />} />
              <Route path="/add" element={<AddContact />} />
              <Route path="/contact/:id" element={<ContactDetails />} />
              <Route path="/edit" element={<EditContact />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
