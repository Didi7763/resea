import { Residence } from '../types/map';

// Données de test pour Cocody, Abidjan - Réparties sur toute la zone
const COCODY_RESIDENCES: Residence[] = [
  {
    id: '1',
    name: 'Résidence Cocody Centre',
    location: {
      latitude: 5.3600,
      longitude: -3.9877
    },
    address: 'Cocody Centre, Abidjan',
    price: 250000,
    rooms: 3,
    surface: 120,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    amenities: ['Climatisation', 'Balcon', 'Parking', 'Sécurité'],
    description: 'Magnifique appartement au cœur de Cocody, proche des commodités.'
  },
  {
    id: '2',
    name: 'Villa Cocody Riviera',
    location: {
      latitude: 5.3750,
      longitude: -3.9750
    },
    address: 'Riviera Palmeraie, Cocody',
    price: 450000,
    rooms: 4,
    surface: 180,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
    amenities: ['Jardin', 'Piscine', 'Climatisation', 'Sécurité 24h'],
    description: 'Villa de luxe avec jardin et piscine dans un quartier calme.'
  },
  {
    id: '3',
    name: 'Appartement Cocody 2 Plateaux',
    location: {
      latitude: 5.3550,
      longitude: -3.9950
    },
    address: '2 Plateaux, Cocody',
    price: 180000,
    rooms: 2,
    surface: 85,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    amenities: ['Climatisation', 'Ascenseur', 'Parking'],
    description: 'Appartement moderne et fonctionnel, idéal pour jeune couple.'
  },
  {
    id: '4',
    name: 'Résidence Cocody Angré',
    location: {
      latitude: 5.3820,
      longitude: -3.9850
    },
    address: 'Angré 8ème Tranche, Cocody',
    price: 320000,
    rooms: 3,
    surface: 140,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    amenities: ['Climatisation', 'Balcon', 'Parking', 'Sécurité', 'Gym'],
    description: 'Résidence moderne avec équipements sportifs et sécurité renforcée.'
  },
  {
    id: '5',
    name: 'Studio Cocody Mermoz',
    location: {
      latitude: 5.3450,
      longitude: -3.9750
    },
    address: 'Mermoz, Cocody',
    price: 120000,
    rooms: 1,
    surface: 45,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    amenities: ['Climatisation', 'Internet', 'Sécurité'],
    description: 'Studio moderne et bien équipé, parfait pour étudiant ou jeune professionnel.'
  },
  {
    id: '6',
    name: 'Duplex Cocody Akouédo',
    location: {
      latitude: 5.3900,
      longitude: -3.9950
    },
    address: 'Akouédo, Cocody',
    price: 380000,
    rooms: 3,
    surface: 160,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    amenities: ['Climatisation', 'Terrasse', 'Parking', 'Sécurité', 'Jardin'],
    description: 'Duplex spacieux avec terrasse et jardin privatif.'
  }
];

class ResidenceService {
  private static instance: ResidenceService;
  private residences: Residence[] = COCODY_RESIDENCES;

  private constructor() {}

  public static getInstance(): ResidenceService {
    if (!ResidenceService.instance) {
      ResidenceService.instance = new ResidenceService();
    }
    return ResidenceService.instance;
  }

  // Récupérer toutes les résidences
  public async getAllResidences(): Promise<Residence[]> {
    try {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...this.residences];
    } catch (error) {
      console.error('Erreur lors de la récupération des résidences:', error);
      throw new Error('Impossible de récupérer les résidences');
    }
  }

  // Récupérer une résidence par ID
  public async getResidenceById(id: string): Promise<Residence | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.residences.find(residence => residence.id === id) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la résidence:', error);
      throw new Error('Impossible de récupérer la résidence');
    }
  }

  // Rechercher des résidences par critères
  public async searchResidences(criteria: {
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    maxRooms?: number;
    location?: { latitude: number; longitude: number; radius: number };
  }): Promise<Residence[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredResidences = [...this.residences];

      // Filtrage par prix
      if (criteria.minPrice !== undefined) {
        filteredResidences = filteredResidences.filter(r => (r.price || 0) >= criteria.minPrice!);
      }
      if (criteria.maxPrice !== undefined) {
        filteredResidences = filteredResidences.filter(r => (r.price || 0) <= criteria.maxPrice!);
      }

      // Filtrage par nombre de chambres
      if (criteria.minRooms !== undefined) {
        filteredResidences = filteredResidences.filter(r => (r.rooms || 0) >= criteria.minRooms!);
      }
      if (criteria.maxRooms !== undefined) {
        filteredResidences = filteredResidences.filter(r => (r.rooms || 0) <= criteria.maxRooms!);
      }

      // Filtrage par distance (si location fournie)
      if (criteria.location) {
        filteredResidences = filteredResidences.filter(residence => {
          const distance = this.calculateDistance(
            criteria.location!.latitude,
            criteria.location!.longitude,
            residence.location.latitude,
            residence.location.longitude
          );
          return distance <= criteria.location!.radius;
        });
      }

      return filteredResidences;
    } catch (error) {
      console.error('Erreur lors de la recherche de résidences:', error);
      throw new Error('Impossible de rechercher les résidences');
    }
  }

  // Calculer la distance entre deux points (formule de Haversine)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance en km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Ajouter une nouvelle résidence (pour tests)
  public async addResidence(residence: Omit<Residence, 'id'>): Promise<Residence> {
    try {
      const newResidence: Residence = {
        ...residence,
        id: Date.now().toString()
      };
      this.residences.push(newResidence);
      return newResidence;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la résidence:', error);
      throw new Error('Impossible d\'ajouter la résidence');
    }
  }

  // Mettre à jour une résidence
  public async updateResidence(id: string, updates: Partial<Residence>): Promise<Residence | null> {
    try {
      const index = this.residences.findIndex(r => r.id === id);
      if (index === -1) return null;
      
      this.residences[index] = { ...this.residences[index], ...updates };
      return this.residences[index];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la résidence:', error);
      throw new Error('Impossible de mettre à jour la résidence');
    }
  }

  // Supprimer une résidence
  public async deleteResidence(id: string): Promise<boolean> {
    try {
      const index = this.residences.findIndex(r => r.id === id);
      if (index === -1) return false;
      
      this.residences.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la résidence:', error);
      throw new Error('Impossible de supprimer la résidence');
    }
  }
}

export default ResidenceService;
