// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const BUSINESS_ID =
  import.meta.env.VITE_BUSINESS_ID || 'default-business-id'

// Feature flags
export const FEATURES = {
  MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH === 'true' || true,
  MOCK_APPOINTMENTS: import.meta.env.VITE_MOCK_APPOINTMENTS === 'true' || true,
}

// Application settings
export const APP_SETTINGS = {
  DEFAULT_LANGUAGE: 'en',
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
}
