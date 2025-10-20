import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const AddProperty = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();

  const steps = [
    {
      id: 'type',
      title: 'Type de bien',
      subtitle: 'Quel type de propriété souhaitez-vous ajouter ?',
      completed: false
    },
    {
      id: 'details',
      title: 'Détails du bien',
      subtitle: 'Informations sur votre propriété',
      completed: false
    },
    {
      id: 'photos',
      title: 'Photos',
      subtitle: 'Ajoutez des photos de votre bien',
      completed: false
    },
    {
      id: 'location',
      title: 'Localisation',
      subtitle: 'Où se trouve votre bien ?',
      completed: false
    },
    {
      id: 'price',
      title: 'Prix',
      subtitle: 'Définissez le prix de votre bien',
      completed: false
    }
  ];

  const propertyTypes = [
    {
      id: 'apartment',
      title: 'Appartement',
      icon: '🏢',
      subtitle: 'Studio, T1, T2, T3...'
    },
    {
      id: 'house',
      title: 'Maison',
      icon: '🏠',
      subtitle: 'Villa, maison individuelle...'
    },
    {
      id: 'office',
      title: 'Bureau',
      icon: '🏢',
      subtitle: 'Espace de travail, local commercial...'
    },
    {
      id: 'land',
      title: 'Terrain',
      icon: '🌿',
      subtitle: 'Terrain constructible, agricole...'
    }
  ];

  const handlePropertyTypeSelect = (typeId: string) => {
    router.push('/propertydetails' as any);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()}>
        <View style={[styles.backButton, { backgroundColor: dark ? COLORS.dark3 : COLORS.white }]}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={dark ? COLORS.white : COLORS.black}
          />
        </View>
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Ajouter un bien
        </Text>
        <Text style={[styles.headerSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
          Devenez partenaire REASA
        </Text>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: COLORS.primary,
              width: `100%`
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: colors.text }]}>
        Étape 1 sur {steps.length}
      </Text>
    </View>
  );

  const renderGetIncomeCard = () => (
    <View style={[styles.incomeCard, { backgroundColor: COLORS.primary }]}>
      <View style={styles.incomeContent}>
        <Text style={styles.incomeTitle}>Générez des revenus avec nous</Text>
        
        <View style={styles.incomeFeatures}>
          <View style={styles.incomeFeature}>
            <Ionicons name="time-outline" size={20} color={COLORS.white} />
            <Text style={styles.incomeFeatureText}>Gestion simplifiée</Text>
          </View>
          
          <View style={styles.incomeFeature}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
            <Text style={styles.incomeFeatureText}>Vos prix</Text>
          </View>
          
          <View style={styles.incomeFeature}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.white} />
            <Text style={styles.incomeFeatureText}>Paiements sécurisés</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPropertyTypes = () => (
    <View style={styles.typesContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Sélectionnez le type de bien
      </Text>
      
      {propertyTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeCard,
            { 
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderColor: dark ? COLORS.dark3 : COLORS.grayscale200
            }
          ]}
          onPress={() => handlePropertyTypeSelect(type.id)}
        >
          <View style={styles.typeContent}>
            <View style={styles.typeLeft}>
              <View style={styles.typeIcon}>
                <Text style={styles.typeEmoji}>{type.icon}</Text>
              </View>
              <View style={styles.typeInfo}>
                <Text style={[styles.typeTitle, { color: colors.text }]}>
                  {type.title}
                </Text>
                <Text style={[styles.typeSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
                  {type.subtitle}
                </Text>
              </View>
            </View>
            
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={dark ? COLORS.grayscale400 : COLORS.grayscale600} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBottomSection = () => (
    <View style={styles.bottomContainer}>
      <Text style={[styles.bottomText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
        Vous avez déjà un compte professionnel ?{' '}
      </Text>
      <TouchableOpacity>
        <Text style={styles.loginText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={[
          dark ? COLORS.dark1 : COLORS.white,
          dark ? COLORS.dark2 : COLORS.tertiaryWhite,
        ]}
        style={styles.content}
      >
        {renderHeader()}
        {renderProgressBar()}
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderGetIncomeCard()}
          {renderPropertyTypes()}
          {renderBottomSection()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'medium',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  incomeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  incomeContent: {
    alignItems: 'center',
  },
  incomeTitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  incomeFeatures: {
    width: '100%',
  },
  incomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  incomeFeatureText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.white,
    marginLeft: 12,
  },
  typesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 16,
  },
  typeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 4,
  },
  typeSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
});

export default AddProperty;














