import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, TextInput, Animated } from 'react-native';
import React, { useState, useCallback, useReducer, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

interface FormState {
  inputValues: {
    email: string;
  };
  inputValidities: {
    email: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: '',
  },
  inputValidities: {
    email: undefined,
  },
  formIsValid: false,
};

const ForgotPasswordEmail = () => {
  const router = useRouter();
    const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'pin' | 'confirmPin'>('email');
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const confirmInputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;


  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

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

  const handleEmailSubmit = async () => {
    if (!formState.inputValidities.email) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email. Vous pouvez maintenant créer un nouveau code PIN.',
        [
          {
            text: 'OK',
            onPress: () => setCurrentStep('pin')
          }
        ]
      );
    } catch (error) {
      console.error('Erreur envoi email:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
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
      // Simulation de réinitialisation du PIN
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Succès',
        'Votre code PIN a été réinitialisé avec succès.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login')
          }
        ]
      );
    } catch (error) {
      console.error('Erreur réinitialisation PIN:', error);
      Alert.alert('Erreur', 'Impossible de réinitialiser le code PIN. Veuillez réessayer.');
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
            Mot de passe oublié
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
              resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>

          {currentStep === 'email' ? (
            // Étape 1: Saisie de l'email
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Réinitialiser votre code PIN
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Saisissez votre adresse email pour recevoir un lien de réinitialisation
              </Text>

              <View style={styles.inputContainer}>
                <Input
                  id="email"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities.email ? [formState.inputValidities.email] : undefined}
                  placeholder="Adresse email"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                  icon={icons.email}
                  keyboardType="email-address"
                                />
                            </View>

              <Button
                title={isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                filled
                onPress={handleEmailSubmit}
                style={styles.button}
                disabled={isLoading || !formState.inputValidities.email}
              />

              <TouchableOpacity
                style={styles.backToLoginContainer}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.backToLoginText}>
                  Retour à la connexion
                </Text>
              </TouchableOpacity>
                            </View>
          ) : currentStep === 'pin' ? (
            // Étape 2: Création du nouveau PIN
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
                style={styles.backToEmailContainer}
                onPress={() => setCurrentStep('email')}
              >
                <Text style={styles.backToEmailText}>
                  Retour à la saisie d&apos;email
                </Text>
                    </TouchableOpacity>
                    </View>
          ) : (
            // Étape 3: Confirmation du PIN
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
                title={isLoading ? 'Réinitialisation...' : 'Réinitialiser le code PIN'}
                filled
                onPress={handleConfirmPinSubmit}
                style={styles.button}
                disabled={isLoading || confirmPin.join('').length !== 4}
              />

                    <TouchableOpacity
                style={styles.backToEmailContainer}
                onPress={() => setCurrentStep('pin')}
              >
                <Text style={styles.backToEmailText}>
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
    marginVertical: 32,
    },
    logo: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    },
    title: {
        fontSize: 24,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 16,
    },
    button: {
    marginTop: 24,
    marginBottom: 16,
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
        fontSize: 16,
    fontFamily: 'medium',
        color: COLORS.primary,
  },
  backToEmailContainer: {
        alignItems: 'center',
    marginTop: 16,
  },
  backToEmailText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary,
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
});

export default ForgotPasswordEmail;