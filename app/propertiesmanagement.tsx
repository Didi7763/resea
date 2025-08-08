import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES } from '@/constants';
import Button from '@/components/Button';

interface PropertyItem {
  id: string;
  title: string;
  neighborhood: string;
  nightlyPrice: number;
}

const initialData: PropertyItem[] = [];

const PropertiesManagement: React.FC = () => {
  const { colors, dark } = useTheme();
  const [properties, setProperties] = useState<PropertyItem[]>(initialData);

  const addMockProperty = () => {
    const id = (properties.length + 1).toString();
    setProperties([
      ...properties,
      {
        id,
        title: `Appartement ${id} - Cocody`,
        neighborhood: 'Abidjan, Cocody',
        nightlyPrice: 45000,
      },
    ]);
  };

  const renderItem = ({ item }: { item: PropertyItem }) => (
    <View style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.cardSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        {item.neighborhood}
      </Text>
      <Text style={styles.cardPrice}>{`${item.nightlyPrice.toLocaleString('fr-FR')} FCFA / nuit`}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Mes Résidences</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
          Ajoutez vos résidences, appartements et studios à Abidjan.
        </Text>

        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>Aucune résidence pour le moment.</Text>
          )}
          contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
        />

        <Button title="Ajouter une résidence" filled onPress={addMockProperty} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontFamily: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: 'regular', marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  cardTitle: { fontSize: 16, fontFamily: 'semiBold' },
  cardSubtitle: { fontSize: 12, fontFamily: 'regular', marginTop: 4 },
  cardPrice: { fontSize: 14, fontFamily: 'semiBold', color: COLORS.primary, marginTop: 8 },
});

export default PropertiesManagement;