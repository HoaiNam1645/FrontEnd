/**
 * API Configuration Utility
 * 
 * This file centralizes API domain and URL configuration for the application.
 * It reads values from environment variables with fallbacks to development defaults.
 */

// API domain from environment variable or default to localhost
export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:5001';

// Full API base URL with path
export const API_URL = `${API_DOMAIN}/api`;

// Helper function to build complete API endpoints
export const buildApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default {
  API_DOMAIN,
  API_URL,
  buildApiUrl
}; 