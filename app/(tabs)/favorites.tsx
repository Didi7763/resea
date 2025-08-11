import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,  // CORRIGÉ : Import standard
  TouchableOpacity,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// SUPPRIMÉ : import { ScrollView } from 'react-native';
// SUPPRIMÉ : import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from 'expo-router';  // CORRIGÉ : Import Expo Router
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';

interface BannerItem {
  id: number;
  discount: string;
  discountName: string;
  bottomTitle: string;
  bottomSubtitle: string;
}

const Favourites = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const [favourites, setFavourites] = useState<BannerItem[]>([]);

  useEffect(() => {
    // Simuler des données de favoris
    setFavourites([
      {
        id: 1,
        discount: '20%',
        discountName: 'Réduction',
        bottomTitle: 'Villa de luxe',
        bottomSubtitle: 'Cocody, Abidjan'
      },
      {
        id: 2,
        discount: '15%',
        discountName: 'Offre spéciale',
        bottomTitle: 'Appartement moderne',
        bottomSubtitle: 'Plateau, Abidjan'
      }
    ]);
  }, []);

  const renderFavouriteItem = ({ item }: { item: BannerItem }) => (
    <View style={[styles.favouriteCard, { backgroundColor: colors.background }]}>
      <View style={styles.cardContent}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
          <Text style={styles.discountName}>{item.discountName}</Text>
        </View>
        <View style={styles.propertyInfo}>
          <Text style={[styles.propertyTitle, { color: colors.text }]}>
            {item.bottomTitle}
          </Text>
          <Text style={[styles.propertySubtitle, { color: colors.text }]}>
            {item.bottomSubtitle}
          </Text>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart" size={24} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Mes Favoris
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {favourites.length > 0 ? (
          <FlatList
            data={favourites}
            renderItem={renderFavouriteItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={80} color={colors.text} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Aucun favori
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text }]}>
                Ajoutez des propriétés à vos favoris pour les retrouver ici
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
  },
  headerSpacer: {
    width: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  favouriteCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  discountText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'bold',
  },
  discountName: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'regular',
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 4,
  },
  propertySubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    opacity: 0.7,
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
});

export default Favourites;