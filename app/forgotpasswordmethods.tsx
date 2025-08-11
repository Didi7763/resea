import React, { useState, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

const { height } = Dimensions.get('window');

interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface FormState {
  inputValues: {
    phoneNumber: string;
  };
  inputValidities: {
    phoneNumber: boolean | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    phoneNumber: '',
  },
  inputValidities: {
    phoneNumber: false,
  },
  formIsValid: false,
};

const ForgotPasswordMethods = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: 'CI',
    name: 'Côte d\'Ivoire',
    dialCode: '+225',
    flag: '🇨🇮'
  });
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Mock country codes data
  const countryCodes: CountryCode[] = [
    { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
    { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
    { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  ];

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

  const handleSendCode = async () => {
    const phoneNumber = formState.inputValues.phoneNumber;
    
    if (!phoneNumber || phoneNumber.length < 8) {
      Alert.alert('Numéro invalide', 'Veuillez saisir un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'envoi de code
      setTimeout(() => {
        setIsLoading(false);
        const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber}`;
        Alert.alert(
          'Code envoyé',
          `Un code à 4 chiffres a été envoyé au ${fullPhoneNumber}`,
          [{
            text: 'Continuer',
            onPress: () => {
              router.push({
                pathname: '/otpverification',
                params: {
                  phone: fullPhoneNumber,
                  source: 'forgot'
                }
              });
            }
          }]
        );
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Impossible d\'envoyer le code. Veuillez réessayer.');
    }
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryModal(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.countryCode, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
          {item.dialCode}
        </Text>
      </View>
      {selectedCountry.code === item.code && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const renderCountryModal = () => (
    <Modal
      visible={showCountryModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCountryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Sélectionner un pays
            </Text>
            <TouchableOpacity
              onPress={() => setShowCountryModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={countryCodes}
            keyExtractor={(item) => item.code}
            renderItem={renderCountryItem}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Récupération
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
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
                Mot de passe oublié ?
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Pas de souci ! Saisissez votre numéro de téléphone et nous vous enverrons un code pour réinitialiser votre mot de passe.
              </Text>

              {/* Phone Input */}
              <View style={styles.phoneInputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Numéro de téléphone
                </Text>
                <View style={[
                  styles.phoneInputWrapper,
                  { 
                    backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                    borderColor: dark ? COLORS.dark3 : COLORS.grayscale200 
                  }
                ]}>
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryModal(true)}
                  >
                    <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                    <Text style={[styles.dialCode, { color: colors.text }]}>
                      {selectedCountry.dialCode}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color={dark ? COLORS.grayscale400 : COLORS.grayscale600}
                    />
                  </TouchableOpacity>
                  <View style={styles.separator} />
                  <TextInput
                    style={[styles.phoneInput, { color: colors.text }]}
                    placeholder="XX XX XX XX"
                    placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale600}
                    value={formState.inputValues.phoneNumber}
                    onChangeText={(text) => inputChangedHandler('phoneNumber', text)}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              </View>

              {/* Info Card */}
              <View style={[styles.infoCard, { backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary }]}>
                <View style={styles.infoIcon}>
                  <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.infoText, { color: dark ? COLORS.white : COLORS.primary }]}>
                  Vous recevrez un code à 4 chiffres par SMS que vous devrez saisir pour confirmer votre identité.
                </Text>
              </View>

              {/* Send Button */}
              <Button
                title={isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
                filled
                onPress={handleSendCode}
                style={styles.sendButton}
                disabled={isLoading || !formState.inputValues.phoneNumber}
              />

              {/* Alternative Methods */}
              <View style={styles.alternativeContainer}>
                <Text style={[styles.alternativeTitle, { color: colors.text }]}>
                  Autres méthodes
                </Text>
                
                <TouchableOpacity
                  style={[styles.alternativeMethod, { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }]}
                  onPress={() => Alert.alert('Indisponible', 'Cette méthode n\'est pas encore disponible')}
                >
                  <View style={styles.alternativeIcon}>
                    <Ionicons name="mail" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.alternativeContent}>
                    <Text style={[styles.alternativeMethodTitle, { color: colors.text }]}>
                      Par email
                    </Text>
                    <Text style={[styles.alternativeMethodDesc, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      Recevoir le code par email
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={dark ? COLORS.grayscale400 : COLORS.grayscale600}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Bottom */}
          <View style={styles.bottomContainer}>
            <Text style={[styles.bottomText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
              Vous vous souvenez de votre mot de passe ?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>

      {renderCountryModal()}
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
  phoneInputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginRight: 8,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.grayscale300,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'regular',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    lineHeight: 20,
  },
  sendButton: {
    marginBottom: 32,
    borderRadius: 30,
  },
  alternativeContainer: {
    marginBottom: 20,
  },
  alternativeTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 16,
  },
  alternativeMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alternativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeMethodTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 4,
  },
  alternativeMethodDesc: {
    fontSize: 14,
    fontFamily: 'regular',
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
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    fontFamily: 'regular',
  },
});

export default ForgotPasswordMethods;