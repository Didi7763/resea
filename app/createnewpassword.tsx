import React, { useState, useCallback, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, icons, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

interface FormState {
  inputValues: {
    password: string;
    confirmPassword: string;
  };
  inputValidities: {
    password: string | undefined;
    confirmPassword: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    password: '',
    confirmPassword: '',
  },
  inputValidities: {
    password: undefined,
    confirmPassword: undefined,
  },
  formIsValid: false,
};

const CreateNewPassword = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;
  const slideAnimation = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
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

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });

      // Calculate password strength
      if (inputId === 'password') {
        calculatePasswordStrength(inputValue);
      }
    },
    [dispatchFormState]
  );

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Number or special character check
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return COLORS.red;
    if (passwordStrength <= 50) return COLORS.orange;
    if (passwordStrength <= 75) return COLORS.yellow;
    return COLORS.green;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Faible';
    if (passwordStrength <= 50) return 'Moyen';
    if (passwordStrength <= 75) return 'Fort';
    return 'Très fort';
  };

  const validatePasswords = () => {
    const { password, confirmPassword } = formState.inputValues;

    if (!password || password.length < 8) {
      Alert.alert('Mot de passe trop court', 'Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mots de passe différents', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (passwordStrength < 50) {
      Alert.alert(
        'Mot de passe faible',
        'Votre mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre ou caractère spécial',
        [
          { text: 'Continuer quand même', onPress: () => handleCreatePassword() },
          { text: 'Modifier', style: 'cancel' }
        ]
      );
      return false;
    }

    return true;
  };

  const handleCreatePassword = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      // Simulation de création de mot de passe
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Mot de passe créé',
          'Votre nouveau mot de passe a été créé avec succès !',
          [{
            text: 'Se connecter',
            onPress: () => router.replace('/login')
          }]
        );
      }, 2000);
    } catch {
      setIsLoading(false);
      Alert.alert('Erreur', 'Impossible de créer le mot de passe. Veuillez réessayer.');
    }
  };

  const passwordRequirements = [
    { text: 'Au moins 8 caractères', met: formState.inputValues.password.length >= 8 },
    { text: 'Une majuscule', met: /[A-Z]/.test(formState.inputValues.password) },
    { text: 'Une minuscule', met: /[a-z]/.test(formState.inputValues.password) },
    { text: 'Un chiffre ou caractère spécial', met: /[0-9!@#$%^&*(),.?":{}|<>]/.test(formState.inputValues.password) },
  ];

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
              Nouveau mot de passe
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
                  source={dark ? illustrations.passwordDark : illustrations.password}
                  resizeMode="contain"
                  style={styles.illustration}
                />
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Créer un nouveau mot de passe
                </Text>
                <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                  Votre nouveau mot de passe doit être différent des mots de passe précédents et sécurisé.
                </Text>

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Nouveau mot de passe
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Input
                      id="password"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.password ? [formState.inputValidities.password] : undefined}
                      autoCapitalize="none"
                      placeholder="Saisissez votre nouveau mot de passe"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.padlock}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={dark ? COLORS.grayscale400 : COLORS.grayscale600}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password Strength */}
                  {formState.inputValues.password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBar}>
                        <View
                          style={[
                            styles.strengthFill,
                            {
                              width: `${passwordStrength}%`,
                              backgroundColor: getPasswordStrengthColor(),
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                        {getPasswordStrengthText()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.passwordContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Confirmer le mot de passe
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Input
                      id="confirmPassword"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.confirmPassword ? [formState.inputValidities.confirmPassword] : undefined}
                      autoCapitalize="none"
                      placeholder="Confirmez votre nouveau mot de passe"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                      icon={icons.padlock}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={dark ? COLORS.grayscale400 : COLORS.grayscale600}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password Match Indicator */}
                  {formState.inputValues.confirmPassword.length > 0 && (
                    <View style={styles.matchIndicator}>
                      <Ionicons
                        name={
                          formState.inputValues.password === formState.inputValues.confirmPassword
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={16}
                        color={
                          formState.inputValues.password === formState.inputValues.confirmPassword
                            ? COLORS.green
                            : COLORS.red
                        }
                      />
                      <Text
                        style={[
                          styles.matchText,
                          {
                            color:
                              formState.inputValues.password === formState.inputValues.confirmPassword
                                ? COLORS.green
                                : COLORS.red,
                          },
                        ]}
                      >
                        {formState.inputValues.password === formState.inputValues.confirmPassword
                          ? 'Les mots de passe correspondent'
                          : 'Les mots de passe ne correspondent pas'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Password Requirements */}
                <View style={[styles.requirementsContainer, { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }]}>
                  <Text style={[styles.requirementsTitle, { color: colors.text }]}>
                    Exigences du mot de passe :
                  </Text>
                  {passwordRequirements.map((requirement, index) => (
                    <View key={index} style={styles.requirementItem}>
                      <Ionicons
                        name={requirement.met ? 'checkmark-circle' : 'ellipse-outline'}
                        size={16}
                        color={requirement.met ? COLORS.green : COLORS.grayscale400}
                      />
                      <Text
                        style={[
                          styles.requirementText,
                          {
                            color: requirement.met
                              ? COLORS.green
                              : dark ? COLORS.grayscale400 : COLORS.grayscale700,
                          },
                        ]}
                      >
                        {requirement.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Create Button */}
                <Button
                  title={isLoading ? 'Création...' : 'Créer le mot de passe'}
                  filled
                  onPress={handleCreatePassword}
                  style={styles.createButton}
                  disabled={
                    isLoading ||
                    !formState.inputValues.password ||
                    !formState.inputValues.confirmPassword ||
                    formState.inputValues.password !== formState.inputValues.confirmPassword
                  }
                />
              </View>
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
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: 200,
    height: 150,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    marginBottom: 32,
  },
  passwordContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 20,
    zIndex: 1,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    textAlign: 'right',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'medium',
    marginLeft: 6,
  },
  requirementsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'regular',
    marginLeft: 8,
  },
  createButton: {
    borderRadius: 30,
  },
});

export default CreateNewPassword;