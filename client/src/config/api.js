// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://wellnessa-backend.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
const API_BASE_URL = config[environment].API_BASE_URL;

// API helper functions
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export { API_BASE_URL };
export default config;
