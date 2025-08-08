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
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

const { width, height } = Dimensions.get('window');

interface FormState {
  inputValues: {
    email: string;
    password: string;
  };
  inputValidities: {
    email: boolean | undefined;
    password: boolean | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const Login = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur de connexion', error);
    }
  }, [error]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulation d'une connexion réussie
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('Email ou mot de passe incorrect');
    }
  };

  const appleAuthHandler = () => {
    console.log('Apple Authentication');
    router.replace('/(tabs)');
  };

  const facebookAuthHandler = () => {
    console.log('Facebook Authentication');
    router.replace('/(tabs)');
  };

  const googleAuthHandler = () => {
    console.log('Google Authentication');
    router.replace('/(tabs)');
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
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={images.logo} resizeMode="contain" style={styles.logo} />
              <Text style={[styles.welcomeText, { color: colors.text }]}>
                Bon retour !
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Connectez-vous à votre compte REASA
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Input
                id="email"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['email']}
                placeholder="Email ou numéro de téléphone"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                icon={icons.email}
                keyboardType="email-address"
              />
              
              <View style={styles.passwordContainer}>
                <Input
                  id="password"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities['password']}
                  autoCapitalize="none"
                  placeholder="Mot de passe"
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

              <View style={styles.checkBoxContainer}>
                <View style={styles.rememberMe}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    color={isChecked ? COLORS.primary : COLORS.grayscale400}
                    onValueChange={setChecked}
                  />
                  <Text style={[styles.rememberText, { color: colors.text }]}>
                    Se souvenir de moi
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/forgotpasswordmethods')}>
                  <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>

              <Button
                title={isLoading ? 'Connexion...' : 'Se connecter'}
                filled
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={isLoading}
              />

              <OrSeparator text="ou continuez avec" />

              <View style={styles.socialContainer}>
                <SocialButton
                  icon={icons.google}
                  onPress={googleAuthHandler}
                />
                <SocialButton
                  icon={icons.facebook}
                  onPress={facebookAuthHandler}
                />
                <SocialButton
                  icon={icons.appleLogo}
                  onPress={appleAuthHandler}
                  tintColor={dark ? COLORS.white : COLORS.black}
                />
              </View>
            </View>
          </ScrollView>

          {/* Bottom */}
          <View style={styles.bottomContainer}>
            <Text style={[styles.bottomText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
              Vous n&aposavez pas de compte ?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupText}>S&aposinscrire</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 20,
    zIndex: 1,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
    height: 20,
    width: 20,
    borderRadius: 4,
  },
  rememberText: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  loginButton: {
    marginVertical: 16,
    borderRadius: 30,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
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
});

export default Login;