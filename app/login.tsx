import React, { useState, useCallback, useReducer, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TextInput, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useRouter } from 'expo-router';

import { COLORS, icons, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

interface FormState {
  inputValues: {
    phoneNumber: string;
  };
  inputValidities: {
    phoneNumber: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    phoneNumber: '',
  },
  inputValidities: {
    phoneNumber: undefined, // undefined = pas encore validé, string = erreur
  },
  formIsValid: false,
};

const Login = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  // Start entrance animations
  Animated.parallel([
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }),
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }),
  ]).start();

  // Nettoyer les champs au montage du composant
  dispatchFormState({
    inputId: 'phoneNumber',
    validationResult: undefined,
    inputValue: '',
  });
}, [fadeAnimation, slideAnimation]);

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

  const handlePhoneSubmit = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de vérification du numéro
      setTimeout(() => {
        setIsLoading(false);
        setShowPinInput(true);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Impossible de vérifier le numéro. Veuillez réessayer.');
    }
  };

  const handlePinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue.length <= 1) {
      const newPin = [...pin];
      newPin[index] = cleanValue;
      setPin(newPin);

      // Auto-focus next input
      if (cleanValue && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto verify when all digits entered
      if (index === 3 && cleanValue) {
        const completePin = [...newPin];
        completePin[3] = cleanValue;
        if (completePin.every(digit => digit !== '')) {
          setTimeout(() => handlePinVerify(completePin.join('')), 300);
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinVerify = async (pinCode?: string) => {
    const codeToVerify = pinCode || pin.join('');
    
    if (codeToVerify.length !== 4) {
      Alert.alert('PIN incomplet', 'Veuillez saisir votre code PIN à 4 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de vérification PIN
      setTimeout(() => {
        // PIN de test : 1234 pour réussir
        if (codeToVerify === '1234') {
          setIsLoading(false);
          Alert.alert(
            'Connexion réussie',
            'Bienvenue dans REASA !',
            [{
              text: 'Continuer',
              onPress: () => router.replace('/(tabs)')
            }]
          );
        } else {
          setIsLoading(false);
          setAttempts(prev => prev + 1);
          
          if (attempts + 1 >= maxAttempts) {
            Alert.alert(
              'Trop de tentatives',
              'Compte temporairement bloqué. Veuillez réessayer plus tard.',
              [{
                text: 'OK',
                onPress: () => {
                  setShowPinInput(false);
                  setPin(['', '', '', '']);
                  setAttempts(0);
                }
              }]
            );
          } else {
            shakeInputs();
            setPin(['', '', '', '']);
            inputRefs.current[0]?.focus();
            Alert.alert(
              'PIN incorrect',
              `PIN incorrect. Il vous reste ${maxAttempts - attempts - 1} tentative(s).`
            );
          }
        }
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={[
            dark ? COLORS.dark1 : COLORS.white,
            dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          ]}
          style={styles.gradientContainer}
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
              Connexion
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <Animated.View
              style={[
                styles.content,
                { 
                  opacity: fadeAnimation,
                  transform: [{ translateY: slideAnimation }]
                }
              ]}
            >
              {/* Illustration */}
              <View style={styles.illustrationContainer}>
                <Image
                  source={dark ? illustrations.welcomeDark : illustrations.welcome}
                  resizeMode="contain"
                  style={styles.illustration}
                />
              </View>

              {!showPinInput ? (
                // Phase 1: Numéro de téléphone
                <View style={styles.formContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Connectez-vous à REASA
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Saisissez votre numéro de téléphone pour continuer
                    </Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Input
                      id="phoneNumber"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.phoneNumber ? [formState.inputValidities.phoneNumber] : undefined}
                      placeholder="Numéro de téléphone"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.call}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.rememberContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={isChecked}
                      onValueChange={setChecked}
                      color={isChecked ? COLORS.primary : undefined}
                    />
                    <Text style={[styles.rememberText, { color: dark ? COLORS.white : COLORS.black }]}>
                      Se souvenir de moi
                    </Text>
                  </View>

                  <Button
                    title={isLoading ? 'Vérification...' : 'Continuer'}
                    filled
                    onPress={handlePhoneSubmit}
                    style={styles.continueButton}
                    disabled={isLoading || !formState.formIsValid}
                  />

                  <View style={styles.signupContainer}>
                    <Text style={[styles.noAccountText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Vous n&apos;avez pas de compte ?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                      <Text style={styles.signupText}>S&apos;inscrire</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.forgotContainer}
                    onPress={() => router.push('/forgotpasswordmethods')}
                  >
                    <Text style={styles.forgotText}>
                      Code PIN oublié ?
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Phase 2: Code PIN
                <View style={styles.formContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Saisissez votre code PIN
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Entrez le code PIN à 4 chiffres pour{'\n'}
                      {formState.inputValues.phoneNumber}
                    </Text>
                  </View>

                  {/* PIN Input */}
                  <Animated.View
                    style={[
                      styles.pinContainer,
                      { transform: [{ translateX: shakeAnimation }] }
                    ]}
                  >
                    {pin.map((digit, index) => (
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

                  {/* Test Info */}
                  <View style={styles.testInfoContainer}>
                    <View style={styles.testInfoBadge}>
                      <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                      <Text style={styles.testInfoText}>
                        Code PIN de test : 1234
                      </Text>
                    </View>
                  </View>

                  {/* Attempts Counter */}
                  {attempts > 0 && (
                    <View style={styles.attemptsContainer}>
                      <Text style={[styles.attemptsText, { color: COLORS.red }]}>
                        Tentatives restantes : {maxAttempts - attempts}
                      </Text>
                    </View>
                  )}

                  <Button
                    title={isLoading ? 'Vérification...' : 'Se connecter'}
                    filled
                    onPress={() => handlePinVerify()}
                    style={styles.verifyButton}
                    disabled={isLoading || pin.some(digit => !digit)}
                  />

                  <View style={styles.backToPhoneContainer}>
                    <TouchableOpacity 
                      onPress={() => {
                        setShowPinInput(false);
                        setPin(['', '', '', '']);
                        setAttempts(0);
                      }}
                      style={styles.backToPhoneButton}
                    >
                      <Text style={[styles.backToPhoneText, { color: COLORS.primary }]}>
                        Changer de numéro
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
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
  gradientContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: 200,
    height: 150,
  },
  formContainer: {
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    marginRight: 12,
  },
  rememberText: {
    fontSize: 14,
    fontFamily: 'medium',
  },
  continueButton: {
    borderRadius: 30,
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noAccountText: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  forgotContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  forgotText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'bold',
    backgroundColor: COLORS.white,
  },
  testInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  testInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  testInfoText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.primary,
    marginLeft: 4,
  },
  attemptsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  attemptsText: {
    fontSize: 14,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  verifyButton: {
    borderRadius: 30,
    marginBottom: 20,
  },
  backToPhoneContainer: {
    alignItems: 'center',
  },
  backToPhoneButton: {
    paddingVertical: 12,
  },
  backToPhoneText: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
});

export default Login;