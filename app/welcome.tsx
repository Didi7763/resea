import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, icons, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import SocialButtonV2 from '../components/SocialButtonV2';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();

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

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} Authentication`);
    // Simulation de connexion réussie
    router.replace('/(tabs)');
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
              Accédez à votre compte REASA et découvrez les meilleures propriétés
            </Text>
          </View>

          {/* Social Login Options */}
          <View style={styles.socialContainer}>
            <SocialButtonV2
              title="Continuer avec Google"
              icon={icons.google}
              onPress={() => handleSocialLogin('Google')}
            />
            <SocialButtonV2
              title="Continuer avec Facebook"
              icon={icons.facebook}
              onPress={() => handleSocialLogin('Facebook')}
            />
            <SocialButtonV2
              title="Continuer avec Apple"
              icon={icons.appleLogo}
              onPress={() => handleSocialLogin('Apple')}
              iconStyles={{ tintColor: dark ? COLORS.white : COLORS.black }}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }]} />
            <Text style={[styles.dividerText, { color: dark ? COLORS.white : COLORS.grayscale700 }]}>
              Ou
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }]} />
          </View>

          {/* Phone Login Button - Modifié pour retirer l'icône */}
          <View style={styles.phoneButtonContainer}>
            <Button
              title="Se connecter avec un numéro"
              filled
              onPress={handlePhoneLogin}
              style={styles.phoneButton}
            />
            <View style={styles.phoneIconOverlay}>
              <Ionicons
                name="call-outline"
                size={20}
                color={COLORS.white}
              />
            </View>
          </View>

          {/* Quick Features */}
          <View style={styles.featuresContainer}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>
              Pourquoi choisir REASA ?
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
        </Animated.View>

        {/* Bottom Section */}
        <Animated.View
          style={[
            styles.bottomContainer,
            { opacity: fadeAnimation }
          ]}
        >
          <Text style={[styles.bottomText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
            Vous n&apos;avez pas de compte ?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>S&apos;inscrire</Text>
          </TouchableOpacity>
        </Animated.View>

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
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 40,
  },
  illustration: {
    width: width * 0.8,
    height: 250,
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
    flex: 0.6,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
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
  socialContainer: {
    marginBottom: 24,
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
  phoneButtonContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  phoneButton: {
    borderRadius: 30,
    paddingLeft: 50, // Espace pour l'icône
  },
  phoneIconOverlay: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -10,
    zIndex: 1,
  },
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    paddingBottom: 20,
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