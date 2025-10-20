import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, icons, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import SocialButtonV2 from '../components/SocialButtonV2';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const { width } = Dimensions.get('window');

const Welcome = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const { user, isLoading, isAuthenticated, signIn } = useGoogleAuth();

  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnimation, slideAnimation, scaleAnimation]);

  const handleGoogleLogin = async () => {
    try {
      await signIn();
      
      // Si l'authentification réussit, naviguer vers l'écran principal
      if (isAuthenticated && user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleLogin();
    }
  };

  const handlePhoneLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
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
        style={styles.container}
      >
        {/* ScrollView STANDARD - PAS DE GESTURE HANDLER */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Top Section - Illustration */}
          <Animated.View
            style={[
              styles.illustrationContainer,
              {
                opacity: fadeAnimation,
                transform: [
                  { translateY: slideAnimation },
                  { scale: scaleAnimation }
                ]
              }
            ]}
          >
            <Image
              source={dark ? illustrations.welcomeDark : illustrations.welcome}
              resizeMode="contain"
              style={styles.illustration}
            />
            
            {/* Floating elements for visual appeal */}
            <View style={[styles.floatingElement, styles.element1]} />
            <View style={[styles.floatingElement, styles.element2]} />
            <View style={[styles.floatingElement, styles.element3]} />
          </Animated.View>

          {/* Content Section */}
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity: fadeAnimation, transform: [{ translateY: slideAnimation }] }
            ]}
          >
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Connectez-vous
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Accédez à votre compte DODO et découvrez les meilleures propriétés
              </Text>
            </View>

            {/* Primary Login Button */}
            <View style={styles.primaryButtonContainer}>
              <Button
                title="Se connecter"
                filled
                onPress={handlePhoneLogin}
                style={styles.primaryButton}
                disabled={isLoading}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: dark ? COLORS.greyscale800 : COLORS.grayscale200 }]} />
              <Text style={[styles.dividerText, { color: dark ? COLORS.white : COLORS.grayscale700 }]}>
                Ou continuer avec
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: dark ? COLORS.greyscale800 : COLORS.grayscale200 }]} />
            </View>

            {/* Google Login */}
            <View style={styles.socialContainer}>
              <SocialButtonV2
                title={isLoading ? "Connexion en cours..." : "Google"}
                icon={icons.google}
                onPress={() => handleSocialLogin('Google')}
                disabled={isLoading}
                style={styles.googleButton}
              />
              
              {/* Bouton de test pour l'authentification Google */}
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: COLORS.secondary }]}
                onPress={() => router.push('/google-auth-test' as any)}
              >
                <Text style={styles.testButtonText}>🧪 Test Auth Google</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Features */}
            <View style={styles.featuresContainer}>
              <Text style={[styles.featuresTitle, { color: colors.text }]}>
                Pourquoi choisir DODO ?
              </Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="home" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.featureText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                    Plus de 10,000 propriétés
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.featureText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                    Transactions sécurisées
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="people" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.featureText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                    Support 24/7
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
              <Text style={[styles.bottomText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Vous n&apos;avez pas de compte ?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupText}>S&apos;inscrire</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Decorative Background Elements */}
        <View style={[styles.backgroundElement, styles.bgElement1, { backgroundColor: COLORS.primary + '10' }]} />
        <View style={[styles.backgroundElement, styles.bgElement2, { backgroundColor: COLORS.secondary + '10' }]} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 40,
    marginBottom: 20,
  },
  illustration: {
    width: width * 0.8,
    height: 200,
    maxWidth: 320,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  element1: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    top: 20,
    left: 20,
  },
  element2: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.secondary,
    bottom: 30,
    right: 30,
  },
  element3: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.tertiary,
    top: 100,
    right: 50,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  primaryButtonContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 30,
    height: 56,
    backgroundColor: COLORS.primary,
  },
  socialContainer: {
    marginBottom: 32,
  },
  googleButton: {
    borderRadius: 30,
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.grayscale200,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'medium',
    marginHorizontal: 16,
  },

  featuresContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 16,
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  testButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  backgroundElement: {
    position: 'absolute',
    borderRadius: 999,
    zIndex: -1,
  },
  bgElement1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  bgElement2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
});

export default Welcome;