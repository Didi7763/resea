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
  FlatList,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

const { width, height } = Dimensions.get('window');

interface DocumentType {
  id: string;
  name: string;
  icon: string;
  uri?: string;
  required: boolean;
  description: string;
}

interface FormState {
  inputValues: {
    businessName: string;
    businessType: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    taxNumber: string;
  };
  inputValidities: {
    businessName: boolean | undefined;
    businessType: boolean | undefined;
    businessAddress: boolean | undefined;
    businessPhone: boolean | undefined;
    businessEmail: boolean | undefined;
    taxNumber: boolean | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    taxNumber: '',
  },
  inputValidities: {
    businessName: false,
    businessType: false,
    businessAddress: false,
    businessPhone: false,
    businessEmail: false,
    taxNumber: false,
  },
  formIsValid: false,
};

const ProfessionalSignup = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: 'idcard_recto',
      name: 'Carte d\'identité (Recto)',
      icon: 'card',
      required: true,
      description: 'Photo du recto de votre carte d\'identité'
    },
    {
      id: 'idcard_verso',
      name: 'Carte d\'identité (Verso)',
      icon: 'card',
      required: true,
      description: 'Photo du verso de votre carte d\'identité'
    },
    {
      id: 'selfie_with_id',
      name: 'Selfie avec carte d\'identité',
      icon: 'camera-selfie',
      required: true,
      description: 'Photo de vous tenant votre carte d\'identité'
    },
    {
      id: 'profile_selfie',
      name: 'Photo de profil',
      icon: 'account-circle',
      required: true,
      description: 'Photo de profil professionnelle'
    },
    {
      id: 'business_license',
      name: 'Licence commerciale',
      icon: 'certificate',
      required: true,
      description: 'Document officiel d\'autorisation d\'exercer'
    },
    {
      id: 'tax_certificate',
      name: 'Certificat fiscal',
      icon: 'receipt',
      required: false,
      description: 'Certificat de situation fiscale'
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'bank_account', name: 'Compte bancaire', selected: false },
    { id: 'mobile_money', name: 'Mobile Money', selected: false },
    { id: 'credit_card', name: 'Carte de crédit', selected: false },
  ]);

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

  const pickImage = async (documentId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        updateDocument(documentId, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const pickDocument = async (documentId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        updateDocument(documentId, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
    }
  };

  const updateDocument = (documentId: string, uri: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId ? { ...doc, uri } : doc
      )
    );
  };

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === methodId
          ? { ...method, selected: !method.selected }
          : method
      )
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Vérifier que tous les documents requis sont fournis
      const missingDocs = documents.filter(doc => doc.required && !doc.uri);
      if (missingDocs.length > 0) {
        Alert.alert('Documents manquants', 'Veuillez fournir tous les documents requis');
        setIsLoading(false);
        return;
      }

      // Vérifier qu'au moins un moyen de paiement est sélectionné
      const selectedPayments = paymentMethods.filter(method => method.selected);
      if (selectedPayments.length === 0) {
        Alert.alert('Moyen de paiement', 'Veuillez sélectionner au moins un moyen de paiement');
        setIsLoading(false);
        return;
      }

      // Simulation d'inscription réussie
      setTimeout(() => {
        setIsLoading(false);
        router.push('/otpverification');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Erreur lors de l\'inscription');
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              {
                backgroundColor: index < currentStep ? COLORS.primary : COLORS.grayscale200,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.progressText, { color: colors.text }]}>
        Étape {currentStep} sur {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Informations commerciales
      </Text>
      <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        Renseignez les informations de votre entreprise
      </Text>

      <Input
        id="businessName"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['businessName']}
        placeholder="Nom commercial *"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.home}
        value={formState.inputValues['businessName']}
      />

      <Input
        id="businessType"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['businessType']}
        placeholder="Type d'activité *"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.work}
        value={formState.inputValues['businessType']}
      />

      <Input
        id="businessAddress"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['businessAddress']}
        placeholder="Adresse commerciale *"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.location}
        value={formState.inputValues['businessAddress']}
      />

      <Input
        id="businessPhone"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['businessPhone']}
        placeholder="Téléphone commercial *"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.call}
        keyboardType="phone-pad"
        value={formState.inputValues['businessPhone']}
      />

      <Input
        id="businessEmail"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['businessEmail']}
        placeholder="Email commercial *"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.email}
        keyboardType="email-address"
        value={formState.inputValues['businessEmail']}
      />

      <Input
        id="taxNumber"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['taxNumber']}
        placeholder="Numéro fiscal"
        placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
        icon={icons.document}
        value={formState.inputValues['taxNumber']}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Documents d&aposidentité
      </Text>
      <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        Téléchargez vos documents d&aposidentité et justificatifs
      </Text>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.documentCard, { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }]}>
            <View style={styles.documentInfo}>
              <View style={styles.documentIcon}>
                <MaterialIcons name={item.icon as any} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.documentDetails}>
                <Text style={[styles.documentName, { color: colors.text }]}>
                  {item.name}
                  {item.required && <Text style={styles.required}> *</Text>}
                </Text>
                <Text style={[styles.documentDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View style={styles.documentActions}>
              {item.uri ? (
                <View style={styles.documentUploaded}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.green} />
                  <Text style={styles.uploadedText}>Téléchargé</Text>
                </View>
              ) : (
                <View style={styles.uploadButtons}>
                  <TouchableOpacity
                    style={[styles.uploadButton, styles.cameraButton]}
                    onPress={() => pickImage(item.id)}
                  >
                    <Ionicons name="camera" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.uploadButton, styles.fileButton]}
                    onPress={() => pickDocument(item.id)}
                  >
                    <Ionicons name="document" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Moyens de paiement
      </Text>
      <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        Sélectionnez vos moyens de paiement préférés
      </Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            {
              backgroundColor: method.selected
                ? COLORS.tansparentPrimary
                : (dark ? COLORS.dark3 : COLORS.grayscale100),
              borderColor: method.selected ? COLORS.primary : 'transparent',
            },
          ]}
          onPress={() => togglePaymentMethod(method.id)}
        >
          <View style={styles.paymentMethodContent}>
            <View style={[
              styles.paymentMethodIcon,
              { backgroundColor: method.selected ? COLORS.primary : COLORS.grayscale400 }
            ]}>
              <Ionicons
                name={
                  method.id === 'bank_account' ? 'card' :
                  method.id === 'mobile_money' ? 'phone-portrait' : 'card'
                }
                size={20}
                color={COLORS.white}
              />
            </View>
            <Text style={[styles.paymentMethodName, { color: colors.text }]}>
              {method.name}
            </Text>
          </View>
          {method.selected && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.reviewContainer}>
        <Text style={[styles.reviewTitle, { color: colors.text }]}>
          Récapitulatif
        </Text>
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
            Documents fournis :
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {documents.filter(doc => doc.uri).length} / {documents.length}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
            Moyens de paiement :
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {paymentMethods.filter(method => method.selected).length} sélectionné(s)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
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
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Inscription Professionnel
            </Text>
            <View style={styles.businessBadge}>
              <Ionicons name="business" size={16} color={COLORS.primary} />
            </View>
          </View>

          {renderProgressBar()}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {renderCurrentStep()}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomContainer}>
            <Button
              title={
                isLoading
                  ? 'Traitement...'
                  : currentStep === totalSteps
                  ? 'Terminer l\'inscription'
                  : 'Continuer'
              }
              filled
              onPress={handleNext}
              style={styles.nextButton}
              disabled={isLoading}
            />
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
    flex: 1,
    textAlign: 'center',
  },
  businessBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'regular',
    marginBottom: 24,
    lineHeight: 24,
  },
  documentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 4,
  },
  required: {
    color: COLORS.red,
  },
  documentDescription: {
    fontSize: 14,
    fontFamily: 'regular',
    lineHeight: 20,
  },
  documentActions: {
    alignItems: 'flex-end',
  },
  documentUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.green,
    marginLeft: 4,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  uploadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
  },
  fileButton: {
    backgroundColor: COLORS.secondary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  reviewContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 12,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  reviewValue: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
  },
  nextButton: {
    borderRadius: 30,
  },
});

export default ProfessionalSignup;