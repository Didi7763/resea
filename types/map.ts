// Types pour la géolocalisation
export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithAccuracy extends Location {
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

// Types pour les résidences
export interface Residence {
  id: string;
  name: string;
  location: Location;
  address?: string;
  price?: number;
  rooms?: number;
  surface?: number;
  images?: string[];
  amenities?: string[];
  description?: string;
}

// Types pour les itinéraires
export interface Route {
  distance: string;
  duration: string;
  polyline: string; // Encoded polyline string
  steps: RouteStep[];
}

export interface RouteStep {
  distance: string;
  duration: string;
  instruction: string;
  maneuver?: string;
}

// Types pour les permissions
export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'restricted' | 'undetermined';
}

// Types pour l'état de la carte
export interface MapState {
  userLocation: LocationWithAccuracy | null;
  selectedResidence: Residence | null;
  currentRoute: Route | null;
  residences: Residence[];
  isLoading: boolean;
  error: string | null;
  permissionStatus: LocationPermission | null;
}

// Types pour les actions de la carte
export interface MapActions {
  requestLocationPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  selectResidence: (residence: Residence) => Promise<void>;
  clearRoute: () => void;
  loadResidences: () => Promise<void>;
  calculateRoute: (origin: Location, destination: Location) => Promise<Route | null>;
}









