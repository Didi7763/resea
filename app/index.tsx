import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { COLORS, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  const { dark } = useTheme();

  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.5)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    const animateEntrance = () => {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Start rotate animation for logo
    const animateRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    };

    animateEntrance();
    animateRotation();

    // Navigate to welcome screen after delay
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={[
          COLORS.primary,
          COLORS.primary + 'CC',
          COLORS.secondary,
        ]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.patternDot,
                {
                  opacity: fadeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.1],
                  }),
                  transform: [
                    {
                      scale: scaleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.random() + 0.5],
                      }),
                    },
                  ],
                  left: Math.random() * width,
                  top: Math.random() * height,
                },
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnimation,
              transform: [
                { scale: scaleAnimation },
                { translateY: slideAnimation },
              ],
            },
          ]}
        >
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoBackground,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            >
              <View style={styles.logoBackgroundInner} />
            </Animated.View>
            
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnimation,
                transform: [{ translateY: slideAnimation }],
              },
            ]}
          >
            <Text style={styles.appName}>REASA</Text>
            <Text style={styles.tagline}>Votre nouveau chez-vous vous attend</Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnimation,
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    width: fadeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>Chargement...</Text>
          </Animated.View>
        </Animated.View>

        {/* Floating Elements */}
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element1,
            {
              opacity: fadeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
              transform: [
                {
                  translateY: fadeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, -10],
                  }),
                },
                { scale: scaleAnimation },
              ],
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element2,
            {
              opacity: fadeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
              transform: [
                {
                  translateY: fadeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 20],
                  }),
                },
                { scale: scaleAnimation },
              ],
            },
          ]}
        />

        {/* Version */}
        <Animated.View
          style={[
            styles.versionContainer,
            {
              opacity: fadeAnimation,
            },
          ]}
        >
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  logoBackgroundInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 18,
  },
  logo: {
    width: 120,
    height: 120,
    tintColor: COLORS.white,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 48,
    fontFamily: 'extraBold',
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    width: width * 0.6,
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: 'rgba(255,255,255,0.8)',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  element1: {
    width: 100,
    height: 100,
    top: height * 0.2,
    left: -50,
  },
  element2: {
    width: 60,
    height: 60,
    bottom: height * 0.25,
    right: -30,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'rgba(255,255,255,0.7)',
  },
});

export default SplashScreen;