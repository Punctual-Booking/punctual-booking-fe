/**
 * API Configuration
 *
 * This file contains environment-specific API configuration,
 * allowing different settings for development and production.
 */

// Base API URL - uses environment variables to determine the correct endpoint
export const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://api.your-production-domain.com' // Replace with your actual production API URL
    : import.meta.env.VITE_BACKEND_URL || 'http://localhost:5244'

// Authentication API paths
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  ME: `${API_BASE_URL}/api/user/me`,
}

/**
 * Default request headers for API calls
 */
export const getDefaultHeaders = (
  includeAuth: boolean = false
): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // Add authentication token if requested and available
  if (includeAuth) {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Default fetch options to help with CORS
 */
export const getDefaultFetchOptions = (
  includeAuth: boolean = false
): RequestInit => {
  return {
    headers: getDefaultHeaders(includeAuth),
    credentials: 'include', // This is important for CORS with cookies
    mode: 'cors', // Explicitly state we're making CORS requests
  }
}

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = import.meta.env.MODE === 'development'
