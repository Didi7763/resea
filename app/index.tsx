import { useTheme } from '@/theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { COLORS, images } from '../constants';

type Nav = {
  navigate: (value: string) => void
}

const Onboarding1 = () => {
  const { navigate } = useNavigation<Nav>();
  const { dark } = useTheme();

  // Add useEffect
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('onboarding');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={dark ? images.splash2 : images.splash4}
      style={styles.area}>
      <StatusBar hidden />
      <LinearGradient
        // Background linear gradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.background}>
        <Text style={styles.greetingText}>Welcome to</Text>
        <Text style={styles.logoName}>Reasa!👋</Text>
        <Text style={styles.subtitle}>The best real estate application to complete your life and family!</Text>
      </LinearGradient>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 270,
    paddingHorizontal: 16
  },
  greetingText: {
    fontSize: 40,
    color: COLORS.white,
    fontFamily: 'bold',
    marginVertical: 12
  },
  logoName: {
    fontSize: 76,
    color: COLORS.white,
    fontFamily: 'extraBold',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 12,
    fontFamily: "semiBold",
  }
})

export default Onboarding1;