import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { settingsStorage } from '../utils/storage';

// Initial state
const initialState = {
  settings: {
    pageSize: 10,
    sortBy: 'name-asc',
    showFavoritesOnly: false,
    defaultCategory: 'other'
  },
  notifications: [],
  sidebarOpen: false,
  currentView: 'list'
};

// Action types
export const ACTIONS = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_SETTING: 'UPDATE_SETTING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
    
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload
          }
        ]
      };
    
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
    
    case ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case ACTIONS.SET_CURRENT_VIEW:
      return {
        ...state,
        currentView: action.payload
      };
    
    case ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Custom hooks
  const contacts = useContacts();
  const favorites = useFavorites();
  const theme = useTheme();

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = settingsStorage.getSettings();
        dispatch({
          type: ACTIONS.SET_SETTINGS,
          payload: storedSettings
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage when they change
  useEffect(() => {
    settingsStorage.setSettings(state.settings);
  }, [state.settings]);

  // Actions
  const updateSetting = (key, value) => {
    dispatch({
      type: ACTIONS.UPDATE_SETTING,
      payload: { key, value }
    });
  };

  const addNotification = (notification) => {
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      payload: notification
    });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id || Date.now());
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({
      type: ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    });
  };

  const toggleSidebar = () => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  };

  const setCurrentView = (view) => {
    dispatch({
      type: ACTIONS.SET_CURRENT_VIEW,
      payload: view
    });
  };

  const clearNotifications = () => {
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Context value
  const value = {
    // State
    settings: state.settings,
    notifications: state.notifications,
    sidebarOpen: state.sidebarOpen,
    currentView: state.currentView,
    
    // Actions
    updateSetting,
    addNotification,
    removeNotification,
    toggleSidebar,
    setCurrentView,
    clearNotifications,
    
    // Custom hooks
    contacts,
    favorites,
    theme
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 