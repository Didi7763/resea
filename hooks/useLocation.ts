import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { LocationWithAccuracy, LocationPermission } from '../types/map';

interface UseLocationReturn {
  location: LocationWithAccuracy | null;
  permissionStatus: LocationPermission | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationWithAccuracy | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Vérifier le statut des permissions au démarrage
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // Nettoyer la subscription lors du démontage
  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  // Vérifier le statut des permissions
  const checkPermissionStatus = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      setPermissionStatus({
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status: status as any
      });

      console.log('📍 Statut des permissions de localisation:', status);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des permissions:', error);
      setError('Impossible de vérifier les permissions de localisation');
    }
  }, []);

  // Demander les permissions
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔐 Demande de permission de localisation...');

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      const newPermissionStatus: LocationPermission = {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status: status as any
      };

      setPermissionStatus(newPermissionStatus);

      if (status === Location.PermissionStatus.GRANTED) {
        console.log('✅ Permission de localisation accordée');
        await getCurrentLocation();
      } else {
        console.log('❌ Permission de localisation refusée');
        setError('Permission de localisation refusée. Veuillez l\'activer dans les paramètres.');
        
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Permission requise',
            'Pour utiliser la géolocalisation, veuillez autoriser l\'accès à votre position dans les paramètres.',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Paramètres', onPress: () => Location.openSettings() }
            ]
          );
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permission:', error);
      setError('Erreur lors de la demande de permission de localisation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir la position actuelle
  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📍 Récupération de la position actuelle...');

      // Vérifier les permissions d'abord
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Permission de localisation non accordée');
      }

      // Obtenir la position actuelle
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10
      });

      const locationData: LocationWithAccuracy = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        altitude: currentLocation.coords.altitude || undefined,
        heading: currentLocation.coords.heading || undefined,
        speed: currentLocation.coords.speed || undefined
      };

      setLocation(locationData);
      console.log('✅ Position actuelle récupérée:', locationData);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la position:', error);
      setError('Impossible de récupérer votre position actuelle');
      
      Alert.alert(
        'Erreur de localisation',
        'Impossible de récupérer votre position. Vérifiez que la géolocalisation est activée.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Démarrer les mises à jour de position
  const startLocationUpdates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Démarrage des mises à jour de position...');

      // Vérifier les permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Permission de localisation non accordée');
      }

      // Configurer les options de localisation
      await Location.setGoogleApiKey('YOUR_GOOGLE_API_KEY'); // Optionnel pour Android

      // Démarrer les mises à jour
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Mise à jour toutes les 10 secondes
          distanceInterval: 10 // Mise à jour si déplacement de 10m
        },
        (newLocation) => {
          const locationData: LocationWithAccuracy = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            altitude: newLocation.coords.altitude || undefined,
            heading: newLocation.coords.heading || undefined,
            speed: newLocation.coords.speed || undefined
          };

          setLocation(locationData);
          console.log('📍 Position mise à jour:', locationData);
        }
      );

      setLocationSubscription(subscription);
      console.log('✅ Mises à jour de position démarrées');
    } catch (error) {
      console.error('❌ Erreur lors du démarrage des mises à jour:', error);
      setError('Impossible de démarrer les mises à jour de position');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Arrêter les mises à jour de position
  const stopLocationUpdates = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
      console.log('⏹️ Mises à jour de position arrêtées');
    }
  }, [locationSubscription]);

  return {
    location,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates
  };
};









