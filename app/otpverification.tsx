import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const OTPVerification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, dark } = useTheme();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Refs for inputs
  const inputRefs = useRef<TextInput[]>([]);

  // Get phone number from params or default
  const phoneNumber = params.phone as string || '+225 XX XX XXX 99';
  const source = params.source as string || 'signup'; // 'signup' ou 'forgot'

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    // Timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    const cleanText = text.replace(/[^0-9]/g, '');
    
    if (cleanText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleanText;
      setOtp(newOtp);

      // Auto focus next input
      if (cleanText && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto verify when all digits entered
      if (index === 3 && cleanText) {
        const completeOtp = [...newOtp];
        completeOtp[3] = cleanText;
        if (completeOtp.every(digit => digit !== '')) {
          setTimeout(() => handleVerify(completeOtp.join('')), 300);
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
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

  const handleVerify = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 4) {
      Alert.alert('Code incomplet', 'Veuillez saisir le code à 4 chiffres');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Simulation de vérification
      setTimeout(() => {
        // Code de test : 1234 pour réussir
        if (codeToVerify === '1234') {
          setIsLoading(false);
          Alert.alert(
            'Vérification réussie',
            'Votre compte a été vérifié avec succès !',
            [{
              text: 'Continuer',
              onPress: () => {
                if (source === 'forgot') {
                  router.replace('/createnewpassword');
                } else {
                  router.replace('/(tabs)');
                }
              }
            }]
          );
        } else {
          setIsLoading(false);
          setAttempts(prev => prev + 1);
          
          if (attempts + 1 >= maxAttempts) {
            Alert.alert(
              'Trop de tentatives',
              'Vous avez dépassé le nombre maximum de tentatives. Veuillez demander un nouveau code.',
              [{
                text: 'OK',
                onPress: () => router.back()
              }]
            );
          } else {
            shakeInputs();
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
            Alert.alert(
              'Code incorrect',
              `Code incorrect. Il vous reste ${maxAttempts - attempts - 1} tentative(s).`
            );
          }
        }
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setAttempts(0);
    setOtp(['', '', '', '']);
    
    try {
      // Simulation d'envoi
      setTimeout(() => {
        Alert.alert('Code envoyé', 'Un nouveau code a été envoyé à votre numéro');
        inputRefs.current[0]?.focus();
      }, 1000);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le code');
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            Vérification
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnimation }
            ]}
          >
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={[styles.phoneIcon, { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale100 }]}>
                <Ionicons name="phone-portrait" size={48} color={COLORS.primary} />
              </View>
              <View style={styles.messageIndicator}>
                <Ionicons name="chatbubble" size={20} color={COLORS.white} />
              </View>
            </View>

            {/* Title and Description */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Code de vérification
              </Text>
              <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Nous avons envoyé un code à 4 chiffres au numéro
              </Text>
              <Text style={[styles.phoneNumber, { color: colors.text }]}>
                {phoneNumber}
              </Text>
            </View>

            {/* OTP Input */}
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
                      borderColor: digit 
                        ? COLORS.primary 
                        : dark ? COLORS.dark3 : COLORS.grayscale200,
                      color: colors.text,
                    }
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
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
                  Code de test : 1234
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

            {/* Verify Button */}
            <Button
              title={isLoading ? 'Vérification...' : 'Vérifier'}
              filled
              onPress={() => handleVerify()}
              style={[
                styles.verifyButton,
                { opacity: otp.every(digit => digit !== '') ? 1 : 0.5 }
              ]}
              disabled={isLoading || !otp.every(digit => digit !== '')}
            />

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                Vous n&aposavez pas reçu le code ?
              </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={!canResend}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendButtonText,
                  { color: canResend ? COLORS.primary : COLORS.grayscale400 }
                ]}>
                  {canResend ? 'Renvoyer le code' : `Renvoyer dans ${formatTimer(resendTimer)}`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Change Number */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.changeNumberButton}
            >
              <Text style={[styles.changeNumberText, { color: COLORS.primary }]}>
                Changer de numéro
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    paddingBottom: 20,
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
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  phoneIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  messageIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: 'semiBold',
    textAlign: 'center',
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
    backgroundColor: COLORS.white,
  },
  testInfoContainer: {
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
    marginBottom: 20,
  },
  attemptsText: {
    fontSize: 14,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  verifyButton: {
    width: width - 32,
    marginBottom: 30,
    borderRadius: 30,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'regular',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  changeNumberButton: {
    paddingVertical: 12,
  },
  changeNumberText: {
    fontSize: 14,
    fontFamily: 'semiBold',
  },
});

export default OTPVerification;