/**
 * API Configuration
 * 
 * This file centralizes API base URL configuration for the application.
 * The API base URL can be configured through environment variables.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present in endpoint
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${formattedEndpoint}`;
};

export default {
  API_BASE_URL,
  getApiUrl
}; 