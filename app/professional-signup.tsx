import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image, TextInput } from 'react-native';
import React, { useState, useCallback, useReducer, memo, useRef, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import { useNavigation } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { validateInput } from '@/utils/actions/formActions';
import { reducer } from '@/utils/reducers/formReducers';

type Nav = {
  goBack: () => void
}

interface FormState {
  inputValues: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  inputValidities: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    phone: string | undefined;
    address: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  },
  inputValidities: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phone: undefined,
    address: undefined,
  },
  formIsValid: false,
};

// ✅ ÉTAPE 1 - Mémorisé avec React.memo
const Step1PersonalInfo = memo(({ 
  formState, 
  inputChangedHandler,
  validateField,
  personalInfo, 
  onPersonalInfoChange,
  colors, 
  dark,
  inputRefs,
  businessTypes,
  experienceLevels
}: any) => {
  
  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Informations personnelles
      </Text>
      <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        Présentez-vous en tant que propriétaire
      </Text>

      <View style={styles.inputContainer}>
        <Input
          ref={inputRefs.firstName}
          id="firstName"
          placeholder="Prénom *"
          value={formState.inputValues.firstName}
          onInputChanged={inputChangedHandler}
          onBlur={validateField}
          errorText={formState.inputValidities.firstName ? [formState.inputValidities.firstName] : undefined}
        />
        
        <Input
          ref={inputRefs.lastName}
          id="lastName"
          placeholder="Nom *"
          value={formState.inputValues.lastName}
          onInputChanged={inputChangedHandler}
          onBlur={validateField}
          errorText={formState.inputValidities.lastName ? [formState.inputValidities.lastName] : undefined}
        />
        
        <Input
          ref={inputRefs.email}
          id="email"
          placeholder="Email professionnel *"
          keyboardType="email-address"
          value={formState.inputValues.email}
          onInputChanged={inputChangedHandler}
          onBlur={validateField}
          errorText={formState.inputValidities.email ? [formState.inputValidities.email] : undefined}
        />
        
        <Input
          ref={inputRefs.phone}
          id="phone"
          placeholder="Téléphone *"
          keyboardType="phone-pad"
          value={formState.inputValues.phone}
          onInputChanged={inputChangedHandler}
          onBlur={validateField}
          errorText={formState.inputValidities.phone ? [formState.inputValidities.phone] : undefined}
        />

        <Text style={[styles.inputLabel, { color: colors.text }]}>Type d&apos;activité *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {businessTypes.map((type: string) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                {
                  backgroundColor: personalInfo.businessType === type 
                    ? COLORS.primary 
                    : (dark ? COLORS.dark3 : COLORS.grayscale100),
                  borderColor: personalInfo.businessType === type 
                    ? COLORS.primary 
                    : COLORS.grayscale200
                }
              ]}
              onPress={() => onPersonalInfoChange('businessType', type)}
            >
              <Text style={[
                styles.chipText,
                { color: personalInfo.businessType === type ? COLORS.white : colors.text }
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.inputLabel, { color: colors.text }]}>Expérience immobilière *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {experienceLevels.map((level: string) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.chip,
                {
                  backgroundColor: personalInfo.experience === level 
                    ? COLORS.primary 
                    : (dark ? COLORS.dark3 : COLORS.grayscale100),
                  borderColor: personalInfo.experience === level 
                    ? COLORS.primary 
                    : COLORS.grayscale200
                }
              ]}
              onPress={() => onPersonalInfoChange('experience', level)}
            >
              <Text style={[
                styles.chipText,
                { color: personalInfo.experience === level ? COLORS.white : colors.text }
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
});

Step1PersonalInfo.displayName = 'Step1PersonalInfo';

// ✅ ÉTAPE 2 - Mémorisé avec React.memo
const Step2PropertyInfo = memo(({ 
  formState, 
  inputChangedHandler,
  validateField,
  propertyInfo, 
  onPropertyInfoChange,
  colors, 
  dark,
  residencePhotos,
  addResidencePhoto,
  removeResidencePhoto,
  inputRefs,
  propertyTypes,
  cities,
  amenities
}: any) => {
  
  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Première propriété
      </Text>
      <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
        Décrivez votre première propriété à lister
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Type de propriété *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {propertyTypes.map((type: string) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                {
                  backgroundColor: propertyInfo.type === type 
                    ? COLORS.primary 
                    : (dark ? COLORS.dark3 : COLORS.grayscale100),
                  borderColor: propertyInfo.type === type 
                    ? COLORS.primary 
                    : COLORS.grayscale200
                }
              ]}
              onPress={() => onPropertyInfoChange('type', type)}
            >
              <Text style={[
                styles.chipText,
                { color: propertyInfo.type === type ? COLORS.white : colors.text }
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Chambres *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Studio', '1', '2', '3', '4', '5+'].map(room => (
                <TouchableOpacity
                  key={room}
                  style={[
                    styles.smallChip,
                    {
                      backgroundColor: propertyInfo.rooms === room 
                        ? COLORS.primary 
                        : (dark ? COLORS.dark3 : COLORS.grayscale100)
                    }
                  ]}
                  onPress={() => onPropertyInfoChange('rooms', room)}
                >
                  <Text style={[
                    styles.smallChipText,
                    { color: propertyInfo.rooms === room ? COLORS.white : colors.text }
                  ]}>{room}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.flex1}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Douche(s) *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['1', '2', '3', '4+'].map(bath => (
                <TouchableOpacity
                  key={bath}
                  style={[
                    styles.smallChip,
                    {
                      backgroundColor: propertyInfo.bathrooms === bath 
                        ? COLORS.primary 
                        : (dark ? COLORS.dark3 : COLORS.grayscale100)
                    }
                  ]}
                  onPress={() => onPropertyInfoChange('bathrooms', bath)}
                >
                  <Text style={[
                    styles.smallChipText,
                    { color: propertyInfo.bathrooms === bath ? COLORS.white : colors.text }
                  ]}>{bath}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: colors.text }]}>Ville *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {cities.map((city: string) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.chip,
                {
                  backgroundColor: propertyInfo.city === city 
                    ? COLORS.primary 
                    : (dark ? COLORS.dark3 : COLORS.grayscale100),
                  borderColor: propertyInfo.city === city 
                    ? COLORS.primary 
                    : COLORS.grayscale200
                }
              ]}
              onPress={() => onPropertyInfoChange('city', city)}
            >
              <Text style={[
                styles.chipText,
                { color: propertyInfo.city === city ? COLORS.white : colors.text }
              ]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Input
          ref={inputRefs.address}
          id="address"
          placeholder="Adresse complète *"
          multiline
          numberOfLines={3}
          value={formState.inputValues.address}
          onInputChanged={inputChangedHandler}
          onBlur={validateField}
          errorText={formState.inputValidities.address ? [formState.inputValidities.address] : undefined}
        />

        <Text style={[styles.inputLabel, { color: colors.text }]}>Équipements</Text>
        <View style={styles.amenitiesGrid}>
          {amenities.map((amenity: any) => (
            <TouchableOpacity
              key={amenity.id}
              style={[
                styles.amenityItem,
                {
                  backgroundColor: propertyInfo.amenities.includes(amenity.id)
                    ? COLORS.tansparentPrimary
                    : (dark ? COLORS.dark3 : COLORS.grayscale100),
                  borderColor: propertyInfo.amenities.includes(amenity.id)
                    ? COLORS.primary
                    : COLORS.grayscale200
                }
              ]}
              onPress={() => onPropertyInfoChange('amenities', amenity.id)}
            >
              {propertyInfo.amenities.includes(amenity.id) && (
                <MaterialIcons name="check" size={16} color={COLORS.primary} />
              )}
              <Text style={[
                styles.amenityText,
                {
                  color: propertyInfo.amenities.includes(amenity.id)
                    ? COLORS.primary
                    : colors.text
                }
              ]}>
                {amenity.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.inputLabel, { color: colors.text, marginTop: 24 }]}>Photos de la résidence *</Text>
        <View style={styles.photosContainer}>
          <View style={styles.mainPhotoContainer}>
            {residencePhotos[0] ? (
              <View style={styles.photoWrapper}>
                <Image source={{ uri: residencePhotos[0] }} style={styles.mainPhoto} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removeResidencePhoto(0)}
                >
                  <MaterialIcons name="close" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.addPhotoButton, styles.mainPhotoButton]}
                onPress={addResidencePhoto}
              >
                <MaterialIcons name="camera-alt" size={32} color={COLORS.grayscale400} />
                <Text style={[styles.addPhotoText, { color: COLORS.grayscale400 }]}>Ajouter une photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.secondaryPhotosContainer}>
            {[1, 2, 3].map(index => (
              <View key={index} style={styles.secondaryPhotoContainer}>
                {residencePhotos[index] ? (
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: residencePhotos[index] }} style={styles.secondaryPhoto} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removeResidencePhoto(index)}
                    >
                      <MaterialIcons name="close" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.addPhotoButton, styles.secondaryPhotoButton]}
                    onPress={addResidencePhoto}
                  >
                    <MaterialIcons name="camera-alt" size={20} color={COLORS.grayscale400} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
});

Step2PropertyInfo.displayName = 'Step2PropertyInfo';

// ✅ ÉTAPE 3 - Mémorisé
const Step3Documents = memo(({ 
  documents, 
  colors, 
  dark, 
  takePhoto, 
  pickDocument, 
  handleDocumentView 
}: any) => (
  <View style={styles.stepContainer}>
    <Text style={[styles.stepTitle, { color: colors.text }]}>
      Documents requis
    </Text>
    <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
      Téléchargez vos justificatifs
    </Text>

    <View style={styles.documentsContainer}>
      {documents.map((doc: any) => (
        <View key={doc.id} style={[
          styles.documentCard,
          { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }
        ]}>
          <View style={styles.documentHeader}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              {doc.name}
              {doc.required && <Text style={styles.required}> *</Text>}
            </Text>
            {doc.uploaded && (
              <View style={styles.uploadedBadge}>
                <MaterialIcons name="check-circle" size={16} color={COLORS.green} />
                <Text style={styles.uploadedText}>Téléchargé</Text>
              </View>
            )}
          </View>
          
          {doc.uploaded && doc.uri && (
            <TouchableOpacity
              style={styles.documentPreview}
              onPress={() => handleDocumentView({name: doc.name, uri: doc.uri!})}
            >
              <Image source={{ uri: doc.uri }} style={styles.documentThumbnail} />
              <View style={styles.previewOverlay}>
                <MaterialIcons name="visibility" size={20} color={COLORS.white} />
                <Text style={styles.previewText}>Voir</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {!doc.uploaded && (
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: COLORS.primary }]}
                onPress={() => takePhoto(doc.id)}
              >
                <MaterialIcons name="camera-alt" size={16} color={COLORS.white} />
                <Text style={styles.uploadButtonText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: COLORS.grayscale400 }]}
                onPress={() => pickDocument(doc.id)}
              >
                <MaterialIcons name="upload-file" size={16} color={COLORS.white} />
                <Text style={styles.uploadButtonText}>Fichier</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {doc.uploaded && (
            <View style={styles.changeButtons}>
              <TouchableOpacity
                style={[styles.changeButton, { backgroundColor: COLORS.orange }]}
                onPress={() => takePhoto(doc.id)}
              >
                <MaterialIcons name="camera-alt" size={16} color={COLORS.white} />
                <Text style={styles.changeButtonText}>Nouvelle Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.changeButton, { backgroundColor: COLORS.grayscale400 }]}
                onPress={() => pickDocument(doc.id)}
              >
                <MaterialIcons name="upload-file" size={16} color={COLORS.white} />
                <Text style={styles.changeButtonText}>Nouveau Fichier</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  </View>
));

Step3Documents.displayName = 'Step3Documents';

// ✅ ÉTAPE 4 - Mémorisé
const Step4Payment = memo(({ 
  paymentMethods, 
  onPaymentMethodToggle, 
  propertyInfo, 
  documents, 
  colors, 
  dark 
}: any) => (
  <View style={styles.stepContainer}>
    <Text style={[styles.stepTitle, { color: colors.text }]}>
      Moyens de paiement
    </Text>
    <Text style={[styles.stepDescription, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
      Comment souhaitez-vous recevoir vos paiements ?
    </Text>

    <View style={styles.paymentContainer}>
      {paymentMethods.map((method: any) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            {
              backgroundColor: method.selected
                ? COLORS.tansparentPrimary
                : (dark ? COLORS.dark3 : COLORS.grayscale100),
              borderColor: method.selected ? COLORS.primary : COLORS.grayscale200,
            },
          ]}
          onPress={() => onPaymentMethodToggle(method.id)}
        >
          <View style={styles.paymentMethodContent}>
            <View style={[
              styles.paymentMethodIcon,
              { backgroundColor: method.selected ? COLORS.primary : COLORS.grayscale400 }
            ]}>
              <MaterialIcons
                name={
                  method.id === 'bank' ? 'account-balance' :
                  method.id === 'mobile_money' ? 'phone-android' : 'payment'
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
            <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>

    <View style={[
      styles.summaryCard,
      { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }
    ]}>
      <Text style={[styles.summaryTitle, { color: colors.text }]}>
        Récapitulatif de votre inscription
      </Text>
      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
          Type de propriété :
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {propertyInfo.type || 'Non spécifié'}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
          Localisation :
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {propertyInfo.city || 'Non spécifiée'}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
          Documents téléchargés :
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {documents.filter((doc: any) => doc.uploaded).length} / {documents.length}
        </Text>
      </View>
    </View>
  </View>
));

Step4Payment.displayName = 'Step4Payment';

const ProfessionalSignup = () => {
  const { dark, colors } = useTheme();
  const { goBack } = useNavigation<Nav>();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  
  const [selectedDocument, setSelectedDocument] = useState<{name: string, uri: string} | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [residencePhotos, setResidencePhotos] = useState<string[]>([]);
  
  // Références pour maintenir le focus
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  
  // ✅ Mémorisé pour éviter la recréation
  const inputRefs = useMemo(() => ({
    firstName: firstNameRef,
    lastName: lastNameRef,
    email: emailRef,
    phone: phoneRef,
    address: addressRef
  }), []);
  
  const [personalInfo, setPersonalInfo] = useState({
    businessType: '',
    experience: ''
  });

  const [propertyInfo, setPropertyInfo] = useState({
    type: '',
    rooms: '',
    bathrooms: '',
    amenities: [] as string[],
    city: '',
  });

  // ✅ CALLBACK STABILISÉ - Mise à jour sans validation
  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      dispatchFormState({
        inputId,
        validationResult: undefined,
        inputValue,
      });
    },
    []
  );

  // ✅ CALLBACK STABILISÉ - Validation au blur
  const validateField = useCallback(
    (inputId: string, inputValue: string) => {
      
      const result = validateInput(inputId, inputValue);
      
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    []
  );

  // ✅ CALLBACK STABILISÉ - Gestion personalInfo
  const handlePersonalInfoChange = useCallback((field: string, value: string) => {
    setPersonalInfo(prev => ({...prev, [field]: value}));
  }, []);

  // ✅ CALLBACK STABILISÉ - Gestion propertyInfo
  const handlePropertyInfoChange = useCallback((field: string, value: string) => {
    if (field === 'amenities') {
      setPropertyInfo(prev => ({
        ...prev,
        amenities: prev.amenities.includes(value)
          ? prev.amenities.filter(a => a !== value)
          : [...prev.amenities, value]
      }));
    } else {
      setPropertyInfo(prev => ({...prev, [field]: value}));
    }
  }, []);

  const [documents, setDocuments] = useState([
    { id: 'profile_photo', name: 'Photo de profil', required: true, uploaded: false, uri: null as string | null },
    { id: 'id_card_front', name: 'Carte d\'identité (Recto)', required: true, uploaded: false, uri: null as string | null },
    { id: 'id_card_back', name: 'Carte d\'identité (Verso)', required: true, uploaded: false, uri: null as string | null },
    { id: 'property_title', name: 'Titre de propriété', required: true, uploaded: false, uri: null as string | null },
    { id: 'business_license', name: 'Licence commerciale', required: false, uploaded: false, uri: null as string | null },
    { id: 'tax_certificate', name: 'Certificat fiscal', required: false, uploaded: false, uri: null as string | null }
  ]);

  // ✅ CALLBACK STABILISÉ - Photos
  const takePhoto = useCallback(async (docId: string) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission refusée", "Vous devez autoriser l'accès à la caméra pour prendre des photos.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setDocuments(docs => docs.map(d => 
          d.id === docId 
            ? { ...d, uploaded: true, uri: result.assets[0].uri }
            : d
        ));
        Alert.alert("Succès", "Photo prise avec succès !");
      }
    } catch (error) {
      console.error("Erreur photo:", error);
      Alert.alert("Erreur", "Impossible de prendre la photo.");
    }
  }, []);

  const pickDocument = useCallback(async (docId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setDocuments(docs => docs.map(d => 
          d.id === docId 
            ? { ...d, uploaded: true, uri: result.assets[0].uri }
            : d
        ));
        Alert.alert("Succès", "Fichier téléchargé avec succès !");
      }
    } catch (error) {
      console.error("Erreur fichier:", error);
      Alert.alert("Erreur", "Impossible de sélectionner le fichier.");
    }
  }, []);

  const handleDocumentView = useCallback((document: {name: string, uri: string}) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  }, []);

  const addResidencePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setResidencePhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Erreur photo:", error);
      Alert.alert("Erreur", "Impossible de sélectionner la photo.");
    }
  }, []);

  const removeResidencePhoto = useCallback((index: number) => {
    setResidencePhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'bank', name: 'Virement bancaire', selected: false },
    { id: 'mobile_money', name: 'Mobile Money', selected: false },
    { id: 'paypal', name: 'PayPal', selected: false }
  ]);

  // ✅ CALLBACK STABILISÉ - Toggle payment method
  const handlePaymentMethodToggle = useCallback((methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(m => m.id === methodId ? {...m, selected: !m.selected} : m)
    );
  }, []);

  // ✅ CONSTANTES MÉMORISÉES - Ne changent jamais
  const propertyTypes = useMemo(() => 
    ['Appartement', 'Maison', 'Studio', 'Villa', 'Duplex', 'Penthouse', 'Loft'], 
  []);
  
  const businessTypes = useMemo(() => 
    ['Propriétaire individuel', 'Agence immobilière', 'Gestionnaire de biens', 'Investisseur', 'Promoteur'], 
  []);
  
  const experienceLevels = useMemo(() => 
    ['Débutant (première propriété)', 'Intermédiaire (2-5 propriétés)', 'Expérimenté (5+ propriétés)', 'Professionnel de l\'immobilier'], 
  []);
  
  const cities = useMemo(() => 
    ['Abidjan', 'Bouaké', 'Daloa', 'San Pedro', 'Yamoussoukro', 'Korhogo', 'Man', 'Gagnoa'], 
  []);
  
  const amenities = useMemo(() => [
    { id: 'wifi', name: 'WiFi' },
    { id: 'parking', name: 'Parking' },
    { id: 'pool', name: 'Piscine' },
    { id: 'garden', name: 'Jardin' },
    { id: 'security', name: 'Sécurité 24h' },
    { id: 'elevator', name: 'Ascenseur' },
    { id: 'balcony', name: 'Balcon' },
    { id: 'furnished', name: 'Meublé' },
    { id: 'netflix', name: 'Netflix' },
    { id: 'aircon', name: 'Climatisation' },
    { id: 'gaming', name: 'Console de jeu' },
    { id: 'jacuzzi', name: 'Jacuzzi' },
    { id: 'tv', name: 'Télévision' }
  ], []);

  const StepIndicator = memo(() => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View key={i} style={styles.progressStepContainer}>
            <View
              style={[
                styles.progressStep,
                {
                  backgroundColor: i + 1 <= currentStep ? COLORS.primary : COLORS.grayscale200,
                },
              ]}
            >
              {i + 1 <= currentStep ? (
                <MaterialIcons name="check" size={16} color={COLORS.white} />
              ) : (
                <Text style={[styles.progressStepText, {
                  color: dark ? COLORS.grayscale400 : COLORS.grayscale700
                }]}>{i + 1}</Text>
              )}
            </View>
            {i < totalSteps - 1 && (
              <View style={[
                styles.progressLine,
                { backgroundColor: i + 1 < currentStep ? COLORS.primary : COLORS.grayscale200 }
              ]} />
            )}
          </View>
        ))}
      </View>
      <Text style={[styles.progressText, { color: colors.text }]}>
        Étape {currentStep} sur {totalSteps}
      </Text>
    </View>
  ));

  StepIndicator.displayName = 'StepIndicator';

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      goBack();
    }
  }, [currentStep, goBack]);

  const handleSubmit = useCallback(() => {
    Alert.alert(
      'Inscription soumise !',
      'Votre dossier sera examiné sous 48h. Vous recevrez un email de confirmation.',
      [
        {
          text: 'OK',
          onPress: () => goBack()
        }
      ]
    );
  }, [goBack]);

  // ✅ PROPS MÉMORISÉS pour Step1
  const step1Props = useMemo(() => ({
    formState,
    inputChangedHandler,
    validateField,
    personalInfo,
    onPersonalInfoChange: handlePersonalInfoChange,
    colors,
    dark,
    inputRefs,
    businessTypes,
    experienceLevels
  }), [formState, inputChangedHandler, validateField, personalInfo, handlePersonalInfoChange, colors, dark, inputRefs, businessTypes, experienceLevels]);

  // ✅ PROPS MÉMORISÉS pour Step2
  const step2Props = useMemo(() => ({
    formState,
    inputChangedHandler,
    validateField,
    propertyInfo,
    onPropertyInfoChange: handlePropertyInfoChange,
    colors,
    dark,
    residencePhotos,
    addResidencePhoto,
    removeResidencePhoto,
    inputRefs,
    propertyTypes,
    cities,
    amenities
  }), [formState, inputChangedHandler, validateField, propertyInfo, handlePropertyInfoChange, colors, dark, residencePhotos, addResidencePhoto, removeResidencePhoto, inputRefs, propertyTypes, cities, amenities]);

  // ✅ PROPS MÉMORISÉS pour Step3
  const step3Props = useMemo(() => ({
    documents,
    colors,
    dark,
    takePhoto,
    pickDocument,
    handleDocumentView
  }), [documents, colors, dark, takePhoto, pickDocument, handleDocumentView]);

  // ✅ PROPS MÉMORISÉS pour Step4
  const step4Props = useMemo(() => ({
    paymentMethods,
    onPaymentMethodToggle: handlePaymentMethodToggle,
    propertyInfo,
    documents,
    colors,
    dark
  }), [paymentMethods, handlePaymentMethodToggle, propertyInfo, documents, colors, dark]);

  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo {...step1Props} />;
      case 2:
        return <Step2PropertyInfo {...step2Props} />;
      case 3:
        return <Step3Documents {...step3Props} />;
      case 4:
        return <Step4Payment {...step4Props} />;
      default:
        return <Step1PersonalInfo {...step1Props} />;
    }
  }, [currentStep, step1Props, step2Props, step3Props, step4Props]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Inscription Propriétaire Pro
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          <StepIndicator />
          {renderCurrentStep()}
        </ScrollView>

        {/* Boutons de navigation */}
        <View style={styles.buttonContainer}>
          <Button
            title="Retour"
            style={[
              styles.button,
              {
                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
              }
            ]}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={handleBack}
          />
          <Button
            title={currentStep === totalSteps ? 'Terminer' : 'Suivant'}
            filled
            style={styles.button}
            onPress={currentStep === totalSteps ? handleSubmit : handleNext}
          />
        </View>
      </View>
      
      {/* Modal de visualisation des documents */}
      <Modal
        visible={showDocumentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDocument?.name}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDocumentModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {selectedDocument && (
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: selectedDocument.uri }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COLORS.grayscale400 }]}
                onPress={() => setShowDocumentModal(false)}
              >
                <Text style={styles.modalButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    fontSize: 14,
    fontFamily: 'medium',
  },
  progressLine: {
    width: 24,
    height: 2,
    marginHorizontal: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'medium',
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'semiBold',
    marginBottom: 8,
  },
  chipContainer: {
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 120,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    minWidth: 40,
  },
  smallChipText: {
    fontSize: 12,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'medium',
  },
  documentsContainer: {
    gap: 16,
  },
  documentCard: {
    padding: 16,
    borderRadius: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    flex: 1,
  },
  required: {
    color: COLORS.red,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadedText: {
    fontSize: 12,
    color: COLORS.green,
    fontFamily: 'medium',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'medium',
  },
  paymentContainer: {
    gap: 16,
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'medium',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    borderRadius: 32,
  },
  documentPreview: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  documentThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  previewText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'medium',
  },
  changeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  changeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  changeButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayscale200,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  photosContainer: {
    marginTop: 12,
  },
  mainPhotoContainer: {
    marginBottom: 12,
  },
  mainPhotoButton: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grayscale200,
    borderStyle: 'dashed',
  },
  mainPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  secondaryPhotosContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryPhotoContainer: {
    flex: 1,
  },
  secondaryPhotoButton: {
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.grayscale200,
    borderStyle: 'dashed',
  },
  secondaryPhoto: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  photoWrapper: {
    position: 'relative',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale100,
  },
  addPhotoText: {
    fontSize: 14,
    fontFamily: 'medium',
    marginTop: 8,
  },
});

export default ProfessionalSignup;