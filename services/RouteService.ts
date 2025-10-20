import { Location, Route, RouteStep, Residence } from '../types/map';
import DistanceService from './DistanceService';
import { GOOGLE_API_CONFIG } from '../constants/api';

class RouteService {
  private static instance: RouteService;
  private distanceService: DistanceService;

  private constructor() {
    this.distanceService = DistanceService.getInstance();
  }

  public static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  // Calculer un itinéraire entre deux points
  public async calculateRoute(origin: Location, destination: Location): Promise<Route | null> {
    try {
      
      const url = `${GOOGLE_API_CONFIG.BASE_URL}/directions/json?` +
        `origin=${origin.latitude},${origin.longitude}` +
        `&destination=${destination.latitude},${destination.longitude}` +
        `&key=${GOOGLE_API_CONFIG.API_KEY}` +
        `&mode=driving` +
        `&language=fr`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        // Extraire les étapes
        const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
          distance: step.distance.text,
          duration: step.duration.text,
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Supprimer les balises HTML
          maneuver: step.maneuver?.instruction || ''
        }));

        const calculatedRoute: Route = {
          distance: leg.distance.text,
          duration: leg.duration.text,
          polyline: route.overview_polyline.points,
          steps: steps
        };

        return calculatedRoute;
      } else {
        console.error('❌ Erreur lors du calcul d\'itinéraire:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur dans calculateRoute:', error);
      return null;
    }
  }

  // Calculer un itinéraire avec des points intermédiaires
  public async calculateRouteWithWaypoints(
    origin: Location, 
    destination: Location, 
    waypoints: Location[]
  ): Promise<Route | null> {
    try {
      
      const waypointsString = waypoints
        .map(wp => `${wp.latitude},${wp.longitude}`)
        .join('|');

      const url = `${GOOGLE_API_CONFIG.BASE_URL}/directions/json?` +
        `origin=${origin.latitude},${origin.longitude}` +
        `&destination=${destination.latitude},${destination.longitude}` +
        `&waypoints=${waypointsString}` +
        `&key=${GOOGLE_API_CONFIG.API_KEY}` +
        `&mode=driving` +
        `&language=fr`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
          distance: step.distance.text,
          duration: step.duration.text,
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          maneuver: step.maneuver?.instruction || ''
        }));

        return {
          distance: leg.distance.text,
          duration: leg.duration.text,
          polyline: route.overview_polyline.points,
          steps: steps
        };
      } else {
        console.error('❌ Erreur lors du calcul d\'itinéraire avec waypoints:', data.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur dans calculateRouteWithWaypoints:', error);
      return null;
    }
  }

  // Calculer la distance et durée entre deux points (sans itinéraire complet)
  public async calculateDistanceAndDuration(origin: Location, destination: Location): Promise<{
    distance: string;
    duration: string;
  } | null> {
    try {
      const route = await this.calculateRoute(origin, destination);
      if (route) {
        return {
          distance: route.distance,
          duration: route.duration
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur dans calculateDistanceAndDuration:', error);
      return null;
    }
  }

  /**
   * Calcule les distances vers toutes les résidences depuis la position utilisateur
   */
  async calculateDistancesToResidences(
    userLocation: { latitude: number; longitude: number },
    residences: Residence[]
  ) {
    try {
      
      const distances = await this.distanceService.getDistancesToMultipleDestinations(
        userLocation,
        residences.map(residence => residence.location)
      );

      // Associer les distances aux résidences
      const residencesWithDistances = residences.map((residence, index) => ({
        ...residence,
        distance: distances[index].distance,
        duration: distances[index].duration,
        distanceStatus: distances[index].status,
      }));

      return residencesWithDistances;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des distances:', error);
      throw error;
    }
  }

  /**
   * Trie les résidences par distance
   */
  sortResidencesByDistance(residences: Residence[]) {
    return residences.sort((a, b) => {
      if (!a.distance || !b.distance) return 0;
      return a.distance.value - b.distance.value;
    });
  }

  /**
   * Filtre les résidences dans un rayon donné
   */
  filterResidencesByRadius(
    residences: Residence[],
    maxDistanceKm: number
  ) {
    return residences.filter(residence => {
      if (!residence.distance) return false;
      return residence.distance.value <= maxDistanceKm * 1000; // Conversion en mètres
    });
  }

  // Décoder une polyline Google
  public decodePolyline(encoded: string): Location[] {
    const poly: Location[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let shift = 0, result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({
        latitude: lat / 1E5,
        longitude: lng / 1E5
      });
    }

    return poly;
  }

  // Calculer la distance à vol d'oiseau entre deux points
  public calculateDirectDistance(point1: Location, point2: Location): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Formater une distance en format lisible
  public formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    } else {
      return `${distanceKm.toFixed(1)} km`;
    }
  }

  // Formater une durée en format lisible
  public formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours}h${remainingMinutes > 0 ? remainingMinutes : ''}`;
    }
  }
}

export default RouteService;


