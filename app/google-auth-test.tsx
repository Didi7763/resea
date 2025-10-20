import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const GoogleAuthTest = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const { user, isLoading, isAuthenticated, signIn, signOut } = useGoogleAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToWelcome} style={styles.backButton}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Test Authentification Google
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {!isAuthenticated ? (
            // État non connecté
            <View style={styles.authSection}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="person-circle-outline" 
                  size={80} 
                  color={COLORS.primary} 
                />
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>
                Connectez-vous avec Google
              </Text>
              
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Testez l'authentification Google et récupérez vos informations
              </Text>

              <TouchableOpacity
                style={[styles.googleButton, { backgroundColor: COLORS.primary }]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.buttonText}>Connexion en cours...</Text>
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="white" />
                    <Text style={styles.buttonText}>Se connecter avec Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // État connecté
            <View style={styles.userSection}>
              <View style={styles.userHeader}>
                {user?.picture ? (
                  <Image source={{ uri: user.picture }} style={styles.userAvatar} />
                ) : (
                  <View style={[styles.userAvatarPlaceholder, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="person" size={40} color="white" />
                  </View>
                )}
                
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {user?.name || 'Utilisateur'}
                  </Text>
                  <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                    {user?.email || 'email@example.com'}
                  </Text>
                </View>
              </View>

              {/* Informations détaillées */}
              <View style={styles.userDetails}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Informations de l'utilisateur
                </Text>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    ID Google:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user?.id || 'Non disponible'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Prénom:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user?.given_name || 'Non disponible'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Nom de famille:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user?.family_name || 'Non disponible'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Email:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user?.email || 'Non disponible'}
                  </Text>
                </View>
              </View>

              {/* Boutons d'action */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.error }]}
                  onPress={handleSignOut}
                  disabled={isLoading}
                >
                  <Ionicons name="log-out-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Se déconnecter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                  onPress={() => {
                    Alert.alert(
                      'Prêt pour le backend !',
                      'Les données utilisateur sont prêtes à être envoyées à votre backend.\n\n' +
                      'Token d\'accès disponible dans la console.\n' +
                      'Email: ' + user?.email + '\n' +
                      'Nom: ' + user?.name,
                      [{ text: 'OK' }]
                    );
                  }}
                >
                  <Ionicons name="server-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Tester Backend</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  authSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userSection: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  userDetails: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
});

export default GoogleAuthTest;









