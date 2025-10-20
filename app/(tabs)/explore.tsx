import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, icons, illustrations, SIZES } from '@/constants';
import Button from '@/components/Button';
import StarRating2 from '@/components/StarRating2';

// Import de nos services et hooks
import { useLocation } from '../../hooks/useLocation';
import { Residence, Location, Route } from '../../types/map';
import ResidenceService from '../../services/ResidenceService';
import RouteService from '../../services/RouteService';

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 112;
const CARD_WIDTH = width * 0.85;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Explore = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [directionModalVisible, setDirectionModalVisible] = useState(false);
  const { dark, colors } = useTheme();

  // États pour nos résidences
  const [residences, setResidences] = useState<Residence[]>([]);
  const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isLoadingResidences, setIsLoadingResidences] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Hook de géolocalisation
  const {
    location: userLocation,
    permissionStatus,
    isLoading: locationLoading,
    error: locationError,
    requestPermission,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates
  } = useLocation();

  // Services
  const residenceService = ResidenceService.getInstance();
  const routeService = RouteService.getInstance();

  // Références
  const _map = useRef<MapView>(null);
  const _scrollView = useRef<ScrollView>(null);

  // Région initiale pour Cocody, Abidjan - Couvre toute la zone
  const initialRegion = {
    latitude: 5.3675,
    longitude: -3.9850,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const [region, setRegion] = useState(initialRegion);

  // Charger les résidences au démarrage
  useEffect(() => {
    loadResidences();
  }, []);

  // Démarrer les mises à jour de position quand les permissions sont accordées
  useEffect(() => {
    if (permissionStatus?.granted && userLocation) {
      startLocationUpdates();
      // Centrer la carte sur la position de l'utilisateur
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [permissionStatus?.granted, userLocation]);

  // Charger les résidences
  const loadResidences = async () => {
    try {
      setIsLoadingResidences(true);
      
      const residencesData = await residenceService.getAllResidences();
      setResidences(residencesData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des résidences:', error);
      Alert.alert('Erreur', 'Impossible de charger les résidences');
    } finally {
      setIsLoadingResidences(false);
    }
  };

  // Gérer la sélection d'une résidence
  const handleResidenceSelect = useCallback(async (residence: Residence) => {
    try {
      setSelectedResidence(residence);
      
      // Centrer la carte sur la résidence sélectionnée
      if (_map.current) {
        _map.current.animateToRegion({
          latitude: residence.location.latitude,
          longitude: residence.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      // Calculer l'itinéraire si l'utilisateur a une position
      if (userLocation) {
        await calculateRouteToResidence(residence);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sélection de la résidence:', error);
    }
  }, [userLocation]);

  // Calculer l'itinéraire vers une résidence
  const calculateRouteToResidence = async (residence: Residence) => {
    if (!userLocation) {
      Alert.alert('Position requise', 'Votre position est nécessaire pour calculer l\'itinéraire');
      return;
    }

    try {
      setIsCalculatingRoute(true);

      const route = await routeService.calculateRoute(userLocation, residence.location);
      
      if (route) {
        setCurrentRoute(route);
      } else {
        Alert.alert('Erreur', 'Impossible de calculer l\'itinéraire');
      }
    } catch (error) {
      console.error('❌ Erreur lors du calcul d\'itinéraire:', error);
      Alert.alert('Erreur', 'Impossible de calculer l\'itinéraire');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Effacer l'itinéraire
  const clearRoute = () => {
    setCurrentRoute(null);
    setSelectedResidence(null);
  };

  // Centrer la carte sur la position de l'utilisateur
  const centerOnUserLocation = async () => {
    try {
      setIsLocating(true);
      
      // Si on n'a pas encore la position, on la récupère
      if (!userLocation) {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
        }
      }
      
      // Centrer la carte sur la position actuelle
      if (_map.current && (userLocation || await getCurrentLocation())) {
        const location = userLocation || await getCurrentLocation();
        if (location) {
          _map.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }, 1000);
        }
      } else {
        Alert.alert('Position', 'Votre position n\'est pas disponible. Vérifiez les permissions de localisation.');
      }
    } catch (error) {
      console.error('❌ Erreur lors du centrage:', error);
      Alert.alert('Erreur', 'Impossible de centrer la carte sur votre position');
    } finally {
      setIsLocating(false);
    }
  };

  // Gérer la demande de permission
  const handleRequestPermission = async () => {
    await requestPermission();
    setModalVisible(false);
  };

  // Décoder la polyline pour l'affichage
  const getRouteCoordinates = (): Location[] => {
    if (!currentRoute?.polyline) return [];
    return routeService.decodePolyline(currentRoute.polyline);
  };

  // Filtrer les résidences selon la recherche
  const filteredResidences = residences.filter(residence =>
    residence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    residence.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Rendu de la searchbar
  const renderSearchBar = () => (
    <View style={[styles.searchBarContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite }]}>
      <Ionicons name="search" size={18} color={COLORS.gray} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder="Rechercher une résidence..."
        placeholderTextColor={COLORS.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={COLORS.gray} />
        </TouchableOpacity>
      )}
    </View>
  );

  // Rendu des cartes de résidences
  const renderResidenceCards = () => (
    <ScrollView
      ref={_scrollView}
      horizontal
      pagingEnabled
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 20}
      contentContainerStyle={styles.scrollViewContent}
      decelerationRate="fast"
    >
      {filteredResidences.map((residence, index) => (
        <TouchableOpacity
          key={residence.id}
          style={[styles.card, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            borderColor: selectedResidence?.id === residence.id ? COLORS.primary : 'transparent'
          }]}
          onPress={() => handleResidenceSelect(residence)}
        >
          <View style={styles.cardImageContainer}>
            {residence.images && residence.images.length > 0 ? (
              <Image
                source={{ uri: residence.images[0] }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.cardImagePlaceholder, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="home" size={40} color={COLORS.primary} />
              </View>
            )}
            <TouchableOpacity style={styles.favouriteButton}>
              <Ionicons 
                name={isFavourite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavourite ? COLORS.error : COLORS.gray} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {residence.name}
            </Text>
            <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>
              {residence.address}
            </Text>
            <View style={styles.cardDetails}>
              <View style={styles.cardDetail}>
                <Ionicons name="bed-outline" size={16} color={COLORS.primary} />
                <Text style={[styles.cardDetailText, { color: colors.textSecondary }]}>
                  {residence.rooms} chambres
                </Text>
              </View>
              {residence.surface && (
                <View style={styles.cardDetail}>
                  <Ionicons name="resize-outline" size={16} color={COLORS.primary} />
                  <Text style={[styles.cardDetailText, { color: colors.textSecondary }]}>
                    {residence.surface}m²
                  </Text>
                </View>
              )}
            </View>
            {residence.price && (
              <Text style={[styles.cardPrice, { color: COLORS.primary }]}>
                {residence.price.toLocaleString()} FCFA
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Rendu du modal de permission
  const renderPermissionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalSubContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }]}>
            <View style={styles.backgroundIllustration}>
              <Image
                source={illustrations.background}
                resizeMode='contain'
                style={styles.modalIllustration}
              />
              <Ionicons name="location-outline" size={40} color={COLORS.primary} style={styles.editPencilIcon} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Activer la localisation</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Nous avons besoin d'accéder à votre position pour trouver les résidences les plus proches.
            </Text>
            <Button
              title="Activer la localisation"
              filled
              onPress={handleRequestPermission}
              style={styles.successBtn}
            />
            <Button
              title="Annuler"
              onPress={() => setModalVisible(false)}
              style={styles.cancelBtn}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec searchbar */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Explorer
        </Text>
        {renderSearchBar()}
      </View>

      {/* Carte */}
      <View style={styles.mapContainer}>
        <MapView
          ref={_map}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
        >
          {/* Marqueurs des résidences */}
          {filteredResidences.map((residence) => (
            <Marker
              key={residence.id}
              coordinate={residence.location}
              title={residence.name}
              description={residence.address}
              onPress={() => handleResidenceSelect(residence)}
            >
              <View style={[
                styles.markerContainer,
                selectedResidence?.id === residence.id && styles.selectedMarker
              ]}>
                <Ionicons 
                  name="home" 
                  size={20} 
                  color={selectedResidence?.id === residence.id ? 'white' : COLORS.primary} 
                />
              </View>
            </Marker>
          ))}

          {/* Itinéraire */}
          {currentRoute && (
            <Polyline
              coordinates={getRouteCoordinates()}
              strokeColor={COLORS.error}
              strokeWidth={4}
              lineDashPattern={[1]}
            />
          )}
        </MapView>

        {/* Bouton de localisation */}
        <TouchableOpacity 
          style={[styles.locationButton, isLocating && styles.locationButtonActive]}
          onPress={centerOnUserLocation}
          activeOpacity={0.7}
          disabled={isLocating}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="locate" size={22} color={COLORS.primary} />
          )}
        </TouchableOpacity>

        {/* Indicateur de chargement */}
        {(locationLoading || isLoadingResidences || isCalculatingRoute) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              {locationLoading ? 'Localisation...' : 
               isLoadingResidences ? 'Chargement des résidences...' : 
               'Calcul d\'itinéraire...'}
            </Text>
          </View>
        )}
      </View>

      {/* Cartes des résidences */}
      <View style={styles.cardsContainer}>
        {renderResidenceCards()}
      </View>

      {/* Modal de permission */}
      {renderPermissionModal()}

      {/* Messages d'erreur */}
      {locationError && (
        <View style={[styles.errorPanel, { backgroundColor: COLORS.error + '20' }]}>
          <Ionicons name="warning-outline" size={20} color={COLORS.error} />
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            {locationError}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray + '30',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  clearButton: {
    padding: 2,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: CARD_HEIGHT + 100, // Espace pour les cartes + barre de navigation
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  locationButtonActive: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  selectedMarker: {
    backgroundColor: COLORS.primary,
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 80, // Au-dessus de la barre de navigation
    left: 0,
    right: 0,
    height: CARD_HEIGHT + 20,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: 80,
    height: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  cardDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: SIZES.width * 0.8,
  },
  backgroundIllustration: {
    position: 'relative',
    marginBottom: 20,
  },
  modalIllustration: {
    width: 100,
    height: 100,
  },
  editPencilIcon: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  successBtn: {
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
  },
  errorPanel: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});

export default Explore;