import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState, useCallback, useReducer } from 'react';
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
    newPassword: string;
    confirmPassword: string;
  };
  inputValidities: {
    email: string | undefined;
    newPassword: string | undefined;
    confirmPassword: string | undefined;
  };
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: '',
    newPassword: '',
    confirmPassword: '',
  },
  inputValidities: {
    email: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  },
  formIsValid: false,
};

const ForgotPasswordEmail = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'password'>('email');


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

  const handleEmailSubmit = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Générer un token de réinitialisation (simulation)
      const token = Math.random().toString(36).substring(2, 15);
      
      Alert.alert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.',
        [
          {
            text: 'OK',
            onPress: () => setCurrentStep('password')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs correctement.');
      return;
    }

    if (formState.inputValues.newPassword !== formState.inputValues.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de réinitialisation du mot de passe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Succès',
        'Votre mot de passe a été réinitialisé avec succès.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de réinitialiser le mot de passe. Veuillez réessayer.');
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
                Réinitialiser votre mot de passe
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
                disabled={isLoading || !formState.formIsValid}
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
          ) : (
            // Étape 2: Nouveau mot de passe
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Créer un nouveau mot de passe
              </Text>
              <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Choisissez un mot de passe sécurisé pour votre compte
              </Text>

              <View style={styles.inputContainer}>
                <Input
                  id="newPassword"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities.newPassword ? [formState.inputValidities.newPassword] : undefined}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                  icon={icons.lock}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  id="confirmPassword"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities.confirmPassword ? [formState.inputValidities.confirmPassword] : undefined}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.grayscale600}
                  icon={icons.lock}
                  secureTextEntry
                />
              </View>

              <Button
                title={isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                filled
                onPress={handlePasswordReset}
                style={styles.button}
                disabled={isLoading || !formState.formIsValid}
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
});

export default ForgotPasswordEmail;