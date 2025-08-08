import React, { useState, useCallback, useReducer, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useRouter } from 'expo-router';

import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

interface FormState {
  inputValues: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  inputValidities: {
    fullName: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    fullName: '',
    email: '',
    phoneNumber: '',
  },
  inputValidities: {
    fullName: undefined,
    email: undefined,
    phoneNumber: undefined,
  },
  formIsValid: false,
};

type SignupStep = 'info' | 'otp' | 'pin' | 'confirm';

const Signup = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<SignupStep>('info');
  
  // OTP states
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  
  // PIN states
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const pinRefs = useRef<(TextInput | null)[]>([]);
  const confirmPinRefs = useRef<(TextInput | null)[]>([]);

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
  }, [fadeAnimation, slideAnimation]);

  // Resend timer effect
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleInfoSubmit = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Informations incomplètes', 'Veuillez remplir tous les champs correctement');
      return;
    }

    if (!isChecked) {
      Alert.alert('Conditions d\'utilisation', 'Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('otp');
        setResendTimer(30);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Impossible de créer le compte. Veuillez réessayer.');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleanValue;
      setOtp(newOtp);

      if (cleanValue && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === 3 && cleanValue) {
        const completeOtp = [...newOtp];
        completeOtp[3] = cleanValue;
        if (completeOtp.every(digit => digit !== '')) {
          setTimeout(() => handleOtpVerify(completeOtp.join('')), 300);
        }
      }
    }
  };

  const handleOtpVerify = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 4) {
      Alert.alert('Code incomplet', 'Veuillez saisir le code à 4 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(() => {
        if (codeToVerify === '1234') {
          setIsLoading(false);
          setCurrentStep('pin');
          setTimeout(() => pinRefs.current[0]?.focus(), 100);
        } else {
          setIsLoading(false);
          setOtpAttempts(prev => prev + 1);
          
          if (otpAttempts + 1 >= 3) {
            Alert.alert('Trop de tentatives', 'Veuillez recommencer l\'inscription.');
          } else {
            shakeInputs();
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
            Alert.alert('Code incorrect', `Il vous reste ${3 - otpAttempts - 1} tentative(s).`);
          }
        }
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handlePinChange = (value: string, index: number, isConfirm: boolean = false) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue.length <= 1) {
      const refs = isConfirm ? confirmPinRefs : pinRefs;
      const currentPin = isConfirm ? confirmPin : pin;
      const setCurrentPin = isConfirm ? setConfirmPin : setPin;
      
      const newPin = [...currentPin];
      newPin[index] = cleanValue;
      setCurrentPin(newPin);

      if (cleanValue && index < 3) {
        refs.current[index + 1]?.focus();
      }

      // Auto switch to confirm PIN when first PIN is complete
      if (!isConfirm && index === 3 && cleanValue && newPin.every(digit => digit !== '')) {
        setShowConfirmPin(true);
        setTimeout(() => confirmPinRefs.current[0]?.focus(), 100);
      }

      // Auto verify when both PINs are complete
      if (isConfirm && index === 3 && cleanValue && newPin.every(digit => digit !== '')) {
        if (pin.join('') === newPin.join('')) {
          setTimeout(() => handlePinSubmit(), 300);
        } else {
          shakeInputs();
          Alert.alert('PIN différents', 'Les codes PIN ne correspondent pas');
          setConfirmPin(['', '', '', '']);
          confirmPinRefs.current[0]?.focus();
        }
      }
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert('PIN incomplet', 'Veuillez saisir les deux codes PIN');
      return;
    }

    if (pin.join('') !== confirmPin.join('')) {
      Alert.alert('PIN différents', 'Les codes PIN ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('confirm');
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Impossible de créer le PIN. Veuillez réessayer.');
    }
  };

  const handleFinalSubmit = () => {
    Alert.alert(
      'Compte créé avec succès !',
      'Votre compte REASA a été créé. Vous pouvez maintenant vous connecter.',
      [{
        text: 'Se connecter',
        onPress: () => router.replace('/login')
      }]
    );
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    
    setResendTimer(30);
    Alert.alert('Code renvoyé', 'Un nouveau code de vérification a été envoyé');
  };

  const renderStepIndicator = () => {
    const steps = ['info', 'otp', 'pin', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={[
              styles.stepDot,
              {
                backgroundColor: index <= currentIndex ? COLORS.primary : 
                  dark ? COLORS.dark3 : COLORS.grayscale200
              }
            ]}>
              {index < currentIndex ? (
                <Ionicons name="checkmark" size={12} color={COLORS.white} />
              ) : (
                <Text style={[styles.stepNumber, { color: index === currentIndex ? COLORS.white : colors.text }]}>
                  {index + 1}
                </Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                { backgroundColor: index < currentIndex ? COLORS.primary : 
                  dark ? COLORS.dark3 : COLORS.grayscale200 }
              ]} />
            )}
          </View>
        ))}
      </View>
    );
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
              Inscription
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

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
              {currentStep === 'info' && (
                <View style={styles.stepContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Créer un compte
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Remplissez vos informations pour commencer
                    </Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Input
                      id="fullName"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.fullName ? [formState.inputValidities.fullName] : undefined}
                      placeholder="Nom complet"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.user}
                      value={formState.inputValues.fullName}
                    />

                    <Input
                      id="email"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.email ? [formState.inputValidities.email] : undefined}
                      placeholder="Adresse e-mail"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.email}
                      keyboardType="email-address"
                      value={formState.inputValues.email}
                    />

                    <Input
                      id="phoneNumber"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.phoneNumber ? [formState.inputValidities.phoneNumber] : undefined}
                      placeholder="Numéro de téléphone"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.call}
                      keyboardType="phone-pad"
                      value={formState.inputValues.phoneNumber}
                    />
                  </View>

                  <View style={styles.termsContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={isChecked}
                      onValueChange={setChecked}
                      color={isChecked ? COLORS.primary : undefined}
                    />
                    <Text style={[styles.termsText, { color: dark ? COLORS.white : COLORS.black }]}>
                      J&apos;accepte les{' '}
                      <Text style={styles.termsLink}>conditions d&apos;utilisation</Text>
                      {' '}et la{' '}
                      <Text style={styles.termsLink}>politique de confidentialité</Text>
                    </Text>
                  </View>

                  <Button
                    title={isLoading ? 'Création...' : 'Continuer'}
                    filled
                    onPress={handleInfoSubmit}
                    style={styles.continueButton}
                    disabled={isLoading || !formState.formIsValid || !isChecked}
                  />
                </View>
              )}

              {currentStep === 'otp' && (
                <View style={styles.stepContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Code de vérification
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Saisissez le code à 4 chiffres envoyé au{'\n'}
                      {formState.inputValues.phoneNumber}
                    </Text>
                  </View>

                  <Animated.View
                    style={[
                      styles.otpContainer,
                      { transform: [{ translateX: shakeAnimation }] }
                    ]}
                  >
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) inputRefs.current[index] = ref;
                        }}
                        style={[
                          styles.otpInput,
                          {
                            backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                            borderColor: digit ? COLORS.primary : 
                              dark ? COLORS.dark3 : COLORS.grayscale200,
                            color: colors.text,
                          }
                        ]}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </Animated.View>

                  {/* Test info removed */}

                  <Button
                    title={isLoading ? 'Vérification...' : 'Vérifier'}
                    filled
                    onPress={() => handleOtpVerify()}
                    style={styles.verifyButton}
                    disabled={isLoading || otp.some(digit => !digit)}
                  />

                  <View style={styles.resendContainer}>
                    <TouchableOpacity 
                      onPress={handleResendOtp}
                      disabled={resendTimer > 0}
                      style={styles.resendButton}
                    >
                      <Text style={[
                        styles.resendText,
                        { color: resendTimer > 0 ? COLORS.grayscale400 : COLORS.primary }
                      ]}>
                        {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : 'Renvoyer le code'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {currentStep === 'pin' && (
                <View style={styles.stepContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Créer un code PIN
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Choisissez un code PIN à 4 chiffres pour sécuriser votre compte
                    </Text>
                  </View>

                  <Text style={[styles.pinLabel, { color: colors.text }]}>
                    Code PIN
                  </Text>
                  <View style={styles.pinContainer}>
                    {pin.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) pinRefs.current[index] = ref;
                        }}
                        style={[
                          styles.pinInput,
                          {
                            backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                            borderColor: digit ? COLORS.primary : 
                              dark ? COLORS.dark3 : COLORS.grayscale200,
                            color: colors.text,
                          }
                        ]}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index, false)}
                        keyboardType="number-pad"
                        maxLength={1}
                        secureTextEntry
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  {showConfirmPin && (
                    <>
                      <Text style={[styles.pinLabel, { color: colors.text, marginTop: 32 }]}>
                        Confirmer le code PIN
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
                              if (ref) confirmPinRefs.current[index] = ref;
                            }}
                            style={[
                              styles.pinInput,
                              {
                                backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                                borderColor: digit ? COLORS.primary : 
                                  dark ? COLORS.dark3 : COLORS.grayscale200,
                                color: colors.text,
                              }
                            ]}
                            value={digit}
                            onChangeText={(text) => handlePinChange(text, index, true)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry
                            selectTextOnFocus
                          />
                        ))}
                      </Animated.View>
                    </>
                  )}

                  <Button
                    title={isLoading ? 'Création...' : 'Créer le PIN'}
                    filled
                    onPress={handlePinSubmit}
                    style={[styles.createPinButton, { marginTop: showConfirmPin ? 32 : 64 }]}
                    disabled={isLoading || pin.some(digit => !digit) || (showConfirmPin && confirmPin.some(digit => !digit))}
                  />
                </View>
              )}

              {currentStep === 'confirm' && (
                <View style={styles.stepContainer}>
                  <View style={styles.illustrationContainer}>
                    <View style={styles.successIcon}>
                      <Ionicons name="checkmark" size={48} color={COLORS.white} />
                    </View>
                  </View>

                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Compte créé avec succès !
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Votre compte REASA est prêt. Vous pouvez maintenant explorer les meilleures propriétés immobilières.
                    </Text>
                  </View>

                  <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                      <Ionicons name="person" size={20} color={COLORS.primary} />
                      <Text style={[styles.summaryText, { color: colors.text }]}>
                        {formState.inputValues.fullName}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name="mail" size={20} color={COLORS.primary} />
                      <Text style={[styles.summaryText, { color: colors.text }]}>
                        {formState.inputValues.email}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name="call" size={20} color={COLORS.primary} />
                      <Text style={[styles.summaryText, { color: colors.text }]}>
                        {formState.inputValues.phoneNumber}
                      </Text>
                    </View>
                  </View>

                  <Button
                    title="Se connecter"
                    filled
                    onPress={handleFinalSubmit}
                    style={styles.finalButton}
                  />
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
  area: { flex: 1 },
  container: { flex: 1 },
  gradientContainer: { flex: 1 },
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
  headerSpacer: { width: 40 },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  scrollView: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContainer: {
    flex: 1,
    paddingBottom: 20,
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
  formContainer: {
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'regular',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontFamily: 'semiBold',
  },
  continueButton: {
    borderRadius: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'bold',
  },
  testInfoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  testInfoText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.primary,
    backgroundColor: COLORS.tansparentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifyButton: {
    borderRadius: 30,
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
  pinLabel: {
    fontSize: 16,
    fontFamily: 'semiBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'bold',
  },
  createPinButton: {
    borderRadius: 30,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    marginVertical: 32,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'medium',
    marginLeft: 16,
  },
  finalButton: {
    borderRadius: 30,
  },
});

export default Signup;