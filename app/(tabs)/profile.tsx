import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '@/components/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { launchImagePicker } from '@/utils/ImagePickerHelper';
import { useNavigation, useRouter } from 'expo-router';
import SettingsItem from '@/components/SettingsItem';

type Nav = {
  navigate: (value: string) => void
}

const Profile = () => {
  const refRBSheet = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const { navigate } = useNavigation<Nav>();
  const router = useRouter();

  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Profile</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  /**
   * render user profile
   */
  const [image, setImage] = useState(images.user1);

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker()

      if (!tempUri) return

      // Set the image
      setImage({ uri: tempUri })
    } catch {
    }
  };

  const renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={image}
            resizeMode='cover'
            style={styles.avatar}
          />
          <TouchableOpacity
            onPress={pickImage}
            style={styles.picContainer}>
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Nathalie Erneson</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>nathalie_erneson@gmail.com</Text>
      </View>
    )
  }
  /**
   * Render Settings
   */
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (dark) {
      setScheme('light');
    } else {
      setScheme('dark');
    }
  };

  const renderSettings = () => {

    return (
      <View style={styles.settingsContainer}>
        {/* Onglets essentiels seulement */}
        <SettingsItem
          icon={icons.userOutline}
          name="Edit Profile"
          onPress={() => navigate("editprofile")}
        />
        <SettingsItem
          icon={icons.home}
          name="Mes Résidences"
          onPress={() => navigate("propertiesmanagement")}
        />
        
        {/* Onglets commentés pour utilisation ultérieure */}
        {/*
        <SettingsItem
          icon={icons.bell3}
          name="My Notification"
          onPress={() => navigate("notifications")}
        />
        <SettingsItem
          icon={icons.calendar}
          name="My Booking"
          onPress={() => navigate("mybooking")}
        />
        <SettingsItem
          icon={icons.location2Outline}
          name="Address"
          onPress={() => navigate("address")}
        />
        <SettingsItem
          icon={icons.bell2}
          name="Notification"
          onPress={() => navigate("settingsnotifications")}
        />
        <SettingsItem
          icon={icons.wallet2Outline}
          name="Payment"
          onPress={() => navigate("settingspayment")}
        />
        <SettingsItem
          icon={icons.fundOutline}
          name="Topup"
          onPress={() => navigate("topupamount")}
        />
        <SettingsItem
          icon={icons.shieldOutline}
          name="Security"
          onPress={() => navigate("settingssecurity")}
        />
        */}
        <TouchableOpacity
          onPress={() => navigate("settingslanguage")}
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Language & Region</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.rightLanguage, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>English (US)</Text>
            <Image
              source={icons.arrowRight}
              resizeMode='contain'
              style={[styles.settingsArrowRight, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Dark Mode</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>
        <SettingsItem
          icon={icons.lockedComputerOutline}
          name="Privacy Policy"
          onPress={() => navigate("settingsprivacypolicy")}
        />
        <SettingsItem
          icon={icons.infoCircle}
          name="Help Center"
          onPress={() => navigate("settingshelpcenter")}
        />
        <SettingsItem
          icon={icons.chatBubble}
          name="Parler à Dodo"
          onPress={() => router.push('/chatbot' as never)}
        />
        <SettingsItem
          icon={icons.people4}
          name="Invite Friends"
          onPress={() => navigate("settingsinvitefriends")}
        />
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}>
          <View style={styles.logoutLeftContainer}>
            <Image
              source={icons.logout}
              resizeMode='contain'
              style={[styles.logoutIcon, {
                tintColor: "red"
              }]}
            />
            <Text style={[styles.logoutName, {
              color: "red"
            }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Render Become Pro Section
   */
  const renderBecomeProSection = () => {
    return (
      <View style={[styles.becomeProContainer, {
        backgroundColor: dark ? COLORS.dark2 : COLORS.white
      }]}>
        {/* Bouton principal Devenir Pro */}
        <TouchableOpacity
          style={[styles.becomeProButton, {
            backgroundColor: COLORS.primary
          }]}
          onPress={() => navigate("professional-signup")}
        >
          <View style={styles.becomeProContent}>
            <MaterialIcons name="business" size={24} color={COLORS.white} />
            <Text style={styles.becomeProText}>Devenir Pro</Text>
          </View>
        </TouchableOpacity>

        {/* Section informative des avantages */}
        <View style={[styles.advantagesContainer, {
          backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
        }]}>
          <Text style={[styles.advantagesTitle, {
            color: dark ? COLORS.white : COLORS.primary
          }]}>Avantages Propriétaire Pro</Text>
          
          <View style={styles.advantagesList}>
            <View style={styles.advantageItem}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.advantageText, {
                color: dark ? COLORS.grayscale400 : COLORS.greyscale700
              }]}>Listez vos propriétés gratuitement</Text>
            </View>
            
            <View style={styles.advantageItem}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.advantageText, {
                color: dark ? COLORS.grayscale400 : COLORS.greyscale700
              }]}>Commissions réduites sur les réservations</Text>
            </View>
            
            <View style={styles.advantageItem}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.advantageText, {
                color: dark ? COLORS.grayscale400 : COLORS.greyscale700
              }]}>Gestion avancée des réservations</Text>
            </View>
            
            <View style={styles.advantageItem}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.advantageText, {
                color: dark ? COLORS.grayscale400 : COLORS.greyscale700
              }]}>Support prioritaire 24/7</Text>
            </View>
            
            <View style={styles.advantageItem}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.advantageText, {
                color: dark ? COLORS.grayscale400 : COLORS.greyscale700
              }]}>Badge &quot;Propriétaire Vérifié&quot;</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          {renderSettings()}
          {renderBecomeProSection()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={240}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 240,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white
          }
        }}
      >
        <Text style={styles.bottomTitle}>Logout</Text>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyscale800 : COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.white : COLORS.black
        }]}>Are you sure you want to log out?</Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Logout"
            filled
            style={styles.logoutButton}
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    paddingVertical: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 4
  },
  settingsContainer: {
    marginVertical: 12
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginRight: 8
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  },
  // Nouveaux styles pour la section Devenir Pro
  becomeProContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden'
  },
  becomeProButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  becomeProContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  becomeProText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "semiBold",
    marginLeft: 12
  },
  advantagesContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12
  },
  advantagesTitle: {
    fontSize: 16,
    fontFamily: "semiBold",
    marginBottom: 12,
    textAlign: 'center'
  },
  advantagesList: {
    gap: 8
  },
  advantageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  advantageText: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 8,
    flex: 1
  }
})

export default Profile