import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Animated,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';

const CreateNewPin = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'pin' | 'confirmPin'>('pin');
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const confirmInputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Animation de shake pour les erreurs PIN
  const shakePin = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
  ]).start();
  };

  // Gestion des changements de PIN
  const handlePinChange = (text: string, index: number, isConfirm = false) => {
    if (text.length > 1) return;
    
    const currentPin = isConfirm ? [...confirmPin] : [...newPin];
    currentPin[index] = text;
    
    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setNewPin(currentPin);
    }

    // Focus sur le champ suivant
    if (text && index < 3) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }
  };

  // Gestion du retour arrière
  const handleKeyPress = (e: any, index: number, isConfirm = false) => {
    if (e.nativeEvent.key === 'Backspace') {
      const currentPin = isConfirm ? [...confirmPin] : [...newPin];
      
      if (currentPin[index] === '' && index > 0) {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handlePinSubmit = () => {
    const pinValue = newPin.join('');
    if (pinValue.length !== 4) {
      shakePin();
      Alert.alert('Erreur', 'Veuillez saisir un code PIN à 4 chiffres.');
      return;
    }

    setCurrentStep('confirmPin');
    // Focus automatique sur le premier champ de confirmation
    setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
  };

  const handleConfirmPinSubmit = async () => {
    const pinValue = newPin.join('');
    const confirmPinValue = confirmPin.join('');
    
    if (confirmPinValue.length !== 4) {
      shakePin();
      Alert.alert('Erreur', 'Veuillez confirmer votre code PIN à 4 chiffres.');
      return;
    }

    if (pinValue !== confirmPinValue) {
      shakePin();
      setConfirmPin(['', '', '', '']);
      Alert.alert('Erreur', 'Les codes PIN ne correspondent pas. Veuillez réessayer.');
      // Focus sur le premier champ de confirmation
      confirmInputRefs.current[0]?.focus();
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de création du PIN
      await new Promise(resolve => setTimeout(resolve, 2000));
      
        Alert.alert(
        'Code PIN créé',
        'Votre nouveau code PIN a été créé avec succès !',
          [{
            text: 'Se connecter',
            onPress: () => router.replace('/login')
          }]
        );
    } catch (error) {
      console.error('Erreur création PIN:', error);
      Alert.alert('Erreur', 'Impossible de créer le code PIN. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[
            dark ? COLORS.dark1 : COLORS.white,
            dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          ]}
        style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
            Nouveau code PIN
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Logo */}
          <View style={styles.logoContainer}>
                <Image
              source={illustrations.password}
                  resizeMode="contain"
                  style={styles.illustration}
                />
              </View>

          {currentStep === 'pin' ? (
            // Étape 1: Création du nouveau PIN
              <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                Créer un nouveau code PIN
                </Text>
                <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Choisissez un code PIN à 4 chiffres pour sécuriser votre compte
                </Text>

              <Animated.View
                style={[
                  styles.pinContainer,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
              >
                {newPin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                          style={[
                      styles.pinInput,
                      {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                        borderColor: digit 
                          ? COLORS.primary 
                          : dark ? COLORS.dark3 : COLORS.grayscale200,
                        color: colors.text,
                      }
                    ]}
                    value={digit}
                    onChangeText={(text) => handlePinChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                  />
                ))}
              </Animated.View>

              <Button
                title="Continuer"
                filled
                onPress={handlePinSubmit}
                style={styles.button}
                disabled={newPin.join('').length !== 4}
              />

                    <TouchableOpacity
                style={styles.backContainer}
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>
                  Retour
                </Text>
                    </TouchableOpacity>
                  </View>
          ) : (
            // Étape 2: Confirmation du PIN
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Confirmer votre code PIN
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Saisissez à nouveau votre code PIN pour le confirmer
              </Text>

              <Animated.View
                        style={[
                  styles.pinContainer,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
              >
                {confirmPin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) confirmInputRefs.current[index] = ref;
                    }}
                        style={[
                      styles.pinInput,
                      {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                        borderColor: digit 
                          ? COLORS.primary 
                          : dark ? COLORS.dark3 : COLORS.grayscale200,
                        color: colors.text,
                      }
                    ]}
                    value={digit}
                    onChangeText={(text) => handlePinChange(text, index, true)}
                    onKeyPress={(e) => handleKeyPress(e, index, true)}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                  />
                ))}
              </Animated.View>

                <Button
                title={isLoading ? 'Création...' : 'Créer le code PIN'}
                  filled
                onPress={handleConfirmPinSubmit}
                style={styles.button}
                disabled={isLoading || confirmPin.join('').length !== 4}
              />

              <TouchableOpacity
                style={styles.backContainer}
                onPress={() => setCurrentStep('pin')}
              >
                <Text style={styles.backText}>
                  Retour au nouveau PIN
                </Text>
              </TouchableOpacity>
              </View>
          )}
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  illustration: {
    width: 280,
    height: 200,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    marginBottom: 40,
    lineHeight: 24,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 32,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 24,
    fontFamily: 'bold',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    marginTop: 32,
    marginBottom: 16,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
});

export default CreateNewPin;