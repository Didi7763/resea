import axios from 'axios';
import { GOOGLE_API_CONFIG } from '../constants/api';

export interface DistanceMatrixRequest {
  origins: string;
  destinations: string;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  units?: 'metric' | 'imperial';
  language?: string;
}

export interface DistanceMatrixResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: Array<{
    elements: Array<{
      distance?: {
        text: string;
        value: number;
      };
      duration?: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

export interface DistanceResult {
  distance?: {
    text: string;
    value: number;
  };
  duration?: {
    text: string;
    value: number;
  };
  status: string;
}

class DistanceService {
  private static instance: DistanceService;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  private constructor() {
    this.apiKey = GOOGLE_API_CONFIG.API_KEY;
  }

  public static getInstance(): DistanceService {
    if (!DistanceService.instance) {
      DistanceService.instance = new DistanceService();
    }
    return DistanceService.instance;
  }

  /**
   * Calcule la distance et le temps entre plusieurs origines et destinations
   */
  async getDistanceMatrix(request: DistanceMatrixRequest): Promise<DistanceMatrixResponse> {
    try {
      const cacheKey = JSON.stringify(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      
      const params = new URLSearchParams({
        origins: request.origins,
        destinations: request.destinations,
        key: this.apiKey,
        mode: request.mode || 'driving',
        units: request.units || 'metric',
        language: request.language || 'fr',
      });

      const response = await axios.get(
        `${GOOGLE_API_CONFIG.BASE_URL}${GOOGLE_API_CONFIG.ENDPOINTS.DISTANCE_MATRIX}?${params}`,
        { timeout: 10000 }
      );

      if (response.data.status === 'OK') {
        this.setCache(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(`Erreur API: ${response.data.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du calcul de distance matrix:', error);
      throw error;
    }
  }

  /**
   * Calcule la distance entre deux coordonnées
   */
  async getDistanceBetweenCoordinates(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    mode: 'driving' | 'walking' | 'bicycling' = 'driving'
  ): Promise<DistanceResult> {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;


      const response = await this.getDistanceMatrix({
        origins: originStr,
        destinations: destinationStr,
        mode,
      });

      if (response.status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
        const result = response.rows[0].elements[0];
        return result;
      }

      throw new Error('Impossible de calculer la distance');
    } catch (error) {
      console.error('❌ Erreur lors du calcul de distance entre coordonnées:', error);
      throw error;
    }
  }

  /**
   * Calcule les distances vers plusieurs destinations depuis une origine
   */
  async getDistancesToMultipleDestinations(
    origin: { latitude: number; longitude: number },
    destinations: Array<{ latitude: number; longitude: number }>,
    mode: 'driving' | 'walking' | 'bicycling' = 'driving'
  ): Promise<Array<DistanceResult & { destination: { latitude: number; longitude: number } }>> {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationsStr = destinations
        .map(dest => `${dest.latitude},${dest.longitude}`)
        .join('|');


      const response = await this.getDistanceMatrix({
        origins: originStr,
        destinations: destinationsStr,
        mode,
      });

      if (response.status === 'OK') {
        const results = response.rows[0].elements.map((element, index) => ({
          destination: destinations[index],
          distance: element.distance,
          duration: element.duration,
          status: element.status,
        }));

        return results;
      }

      throw new Error('Impossible de calculer les distances');
    } catch (error) {
      console.error('❌ Erreur lors du calcul des distances multiples:', error);
      throw error;
    }
  }

  /**
   * Gestion du cache
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default DistanceService;
