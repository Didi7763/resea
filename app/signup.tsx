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
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
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
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  inputValidities: {
    firstName: boolean | undefined;
    lastName: boolean | undefined;
    phone: boolean | undefined;
    email: boolean | undefined;
    password: boolean | undefined;
    confirmPassword: boolean | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const Signup = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userType, setUserType] = useState<'individual' | 'professional'>('individual');
  const [showUserTypeModal, setShowUserTypeModal] = useState(true);

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
      Alert.alert('Erreur d\'inscription', error);
    }
  }, [error]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!isChecked) {
      Alert.alert('Conditions d\'utilisation', 'Veuillez accepter les conditions d\'utilisation');
      return;
    }

    if (!profileImage) {
      Alert.alert('Photo requise', 'Veuillez ajouter une photo de profil');
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'inscription réussie
      setTimeout(() => {
        setIsLoading(false);
        if (userType === 'professional') {
          router.push('/professional-signup');
        } else {
          router.push('/otpverification');
        }
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('Erreur lors de l\'inscription');
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

  const renderUserTypeModal = () => (
    <Modal
      visible={showUserTypeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUserTypeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Type de compte
          </Text>
          <Text style={[styles.modalSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
            Choisissez le type de compte qui vous convient
          </Text>

          <TouchableOpacity
            style={[
              styles.userTypeOption,
              userType === 'individual' && styles.selectedUserType,
              { borderColor: dark ? COLORS.dark3 : COLORS.grayscale200 }
            ]}
            onPress={() => setUserType('individual')}
          >
            <View style={styles.userTypeIcon}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.userTypeContent}>
              <Text style={[styles.userTypeTitle, { color: colors.text }]}>
                Particulier
              </Text>
              <Text style={[styles.userTypeDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Pour rechercher et louer des propriétés
              </Text>
            </View>
            {userType === 'individual' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeOption,
              userType === 'professional' && styles.selectedUserType,
              { borderColor: dark ? COLORS.dark3 : COLORS.grayscale200 }
            ]}
            onPress={() => setUserType('professional')}
          >
            <View style={styles.userTypeIcon}>
              <Ionicons name="business" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.userTypeContent}>
              <Text style={[styles.userTypeTitle, { color: colors.text }]}>
                Professionnel
              </Text>
              <Text style={[styles.userTypeDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Pour proposer des propriétés en location
              </Text>
            </View>
            {userType === 'professional' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <Button
            title="Continuer"
            filled
            onPress={() => setShowUserTypeModal(false)}
            style={styles.continueButton}
          />
        </View>
      </View>
    </Modal>
  );

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
            <View style={styles.userTypeBadge}>
              <Ionicons 
                name={userType === 'individual' ? 'person' : 'business'} 
                size={16} 
                color={COLORS.primary} 
              />
              <Text style={styles.userTypeBadgeText}>
                {userType === 'individual' ? 'Particulier' : 'Professionnel'}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={images.logo} resizeMode="contain" style={styles.logo} />
              <Text style={[styles.welcomeText, { color: colors.text }]}>
                Créer un compte
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Rejoignez REASA et trouvez votre nouveau chez-vous
              </Text>
            </View>

            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.profileImageButton}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImagePlaceholder, { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }]}>
                    <Ionicons name="camera" size={32} color={COLORS.primary} />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </View>
              </TouchableOpacity>
              <Text style={[styles.profileImageText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Photo de profil *
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Input
                id="firstName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['firstName']}
                placeholder="Prénom *"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                icon={icons.profile}
              />

              <Input
                id="lastName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['lastName']}
                placeholder="Nom *"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                icon={icons.profile}
              />

              <Input
                id="phone"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['phone']}
                placeholder="Numéro de téléphone *"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                icon={icons.call}
                keyboardType="phone-pad"
              />

              <Input
                id="email"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['email']}
                placeholder="Email"
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
                  placeholder="Mot de passe *"
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

              <View style={styles.passwordContainer}>
                <Input
                  id="confirmPassword"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities['confirmPassword']}
                  autoCapitalize="none"
                  placeholder="Confirmer le mot de passe *"
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

              <View style={styles.checkBoxContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked}
                  color={isChecked ? COLORS.primary : COLORS.grayscale400}
                  onValueChange={setChecked}
                />
                <Text style={[styles.termsText, { color: colors.text }]}>
                  J&aposaccepte les{' '}
                  <Text style={styles.linkText}>conditions d&aposutilisation</Text>
                  {' '}et la{' '}
                  <Text style={styles.linkText}>politique de confidentialité</Text>
                </Text>
              </View>

              <Button
                title={isLoading ? 'Inscription...' : 'S\'inscrire'}
                filled
                onPress={handleSignup}
                style={styles.signupButton}
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
              Vous avez déjà un compte ?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>

      {renderUserTypeModal()}
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userTypeBadgeText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageButton: {
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileImageText: {
    fontSize: 12,
    fontFamily: 'regular',
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
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
    height: 20,
    width: 20,
    borderRadius: 4,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'regular',
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: 'semiBold',
  },
  signupButton: {
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
  loginText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 20,
    padding: 24,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  userTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  selectedUserType: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tansparentPrimary,
  },
  userTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 4,
  },
  userTypeDescription: {
    fontSize: 14,
    fontFamily: 'regular',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 16,
    borderRadius: 30,
  },
});

export default Signup;