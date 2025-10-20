export const GOOGLE_API_CONFIG = {
  BASE_URL: 'https://maps.googleapis.com/maps/api',
  API_KEY: 'VOTRE_CLE_API_ICI', // Remplacez par votre vraie clé API
  ENDPOINTS: {
    DISTANCE_MATRIX: '/distancematrix/json',
    DIRECTIONS: '/directions/json',
    GEOCODING: '/geocode/json',
  }
};

// Configuration pour les requêtes
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Messages d'erreur
export const API_ERROR_MESSAGES = {
  INVALID_API_KEY: 'Clé API invalide',
  QUOTA_EXCEEDED: 'Quota de requêtes dépassé',
  NETWORK_ERROR: 'Erreur de réseau',
  INVALID_REQUEST: 'Requête invalide',
  UNKNOWN_ERROR: 'Erreur inconnue',
};


