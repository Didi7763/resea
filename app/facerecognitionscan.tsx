import Button from '@/components/Button';
import { COLORS, SIZES, illustrations, images } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

type Nav = {
  navigate: (value: string) => void
}

const FaceRecognitionScan = () => {
  const { dark } = useTheme();
  const { navigate } = useNavigation<Nav>();
  const [modalVisible, setModalVisible] = useState(false);

  // When modalVisible flips to true, wait 1s then navigate
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (modalVisible) {
      timer = setTimeout(() => {
        setModalVisible(false);
        navigate('login');
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [modalVisible, navigate]);

  // Render modal
  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalSubContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
            }]}>
              <Image
                source={illustrations.user}
                resizeMode='contain'
                style={styles.modalIllustration}
              />
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text style={[styles.modalSubtitle, {
                color: dark ? COLORS.grayTie : COLORS.greyscale900
              }]}>Your account is ready to use. You will be redirected to the Home page in a few seconds..</Text>
              <View style={{ marginTop: 16 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  };

  return (
    <ImageBackground
      source={images.face}
      style={styles.backgroundImage}>
      <Image
        source={images.scanCard}
        resizeMode='contain'
        style={styles.scanCardImage}
      />
      <View style={styles.viewContainer}>
        <Text style={styles.viewTitle}>100%</Text>
        <Text style={styles.viewSubtitle}>Verifying your face...</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Skip"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            borderRadius: 32,
            backgroundColor: dark ? COLORS.dark2 : "#E9F0FF",
            borderColor: dark ? COLORS.dark2 : "#E9F0FF"
          }}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => setModalVisible(true)}
        />
        <Button
          title="Start"
          filled
          style={styles.continueButton}
          onPress={() => setModalVisible(true)}
        />
      </View>
      {renderModal()}
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center"
  },
  skipButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: "#F5E7FF",
    borderColor: "#F5E7FF"
  },
  continueButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  scanCardImage: {
    height: SIZES.width - 32,
    width: SIZES.width - 32
  },
  viewContainer: {
    position: "absolute",
    bottom: 124,
    right: 16,
    left: 16,
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center"
  },
  viewTitle: {
    fontSize: 48,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: 4
  },
  viewSubtitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.white
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black2,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  }
})

export default FaceRecognitionScan