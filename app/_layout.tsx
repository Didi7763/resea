import React from "react";
import "react-native-reanimated";

import { FONTS } from "@/constants/fonts";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, FC } from "react";
import { LogBox } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Ignore specific log notifications (au lieu de tout ignorer)
LogBox.ignoreLogs(["Warning: ...", "Deprecation warning: ..."]);

const RootLayout: FC = () => {
  const [fontsLoaded] = useFonts(FONTS);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="professional-signup" />
        <Stack.Screen name="createnewpassword" />
        <Stack.Screen name="forgotpasswordmethods" />
        <Stack.Screen name="forgotpasswordphonenumber" />
        <Stack.Screen name="forgotpasswordemail" />
        <Stack.Screen name="otpverification" />
        <Stack.Screen name="createnewpin" />
        <Stack.Screen name="reasonforusingreasa" />
        <Stack.Screen name="verifyyouridentity" />
        <Stack.Screen name="proofofresidency" />
        <Stack.Screen name="photoidcard" />
        <Stack.Screen name="selfiewithidcard" />
        <Stack.Screen name="facerecognitionwalkthrough" />
        <Stack.Screen name="facerecognitionscan" />
        <Stack.Screen name="addnewcard" />
        <Stack.Screen name="settingsinvitefriends" />
        <Stack.Screen name="settingshelpcenter" />
        <Stack.Screen name="settingslanguage" />
        <Stack.Screen name="settingsnotifications" />
        <Stack.Screen name="settingssecurity" />
        <Stack.Screen name="customerservice" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="addnewaddress" />
        <Stack.Screen name="address" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="bookingdetails" />
        <Stack.Screen name="call" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="estatedetails" />
        <Stack.Screen name="estatereviews" />
        <Stack.Screen name="featuredestates" />
        <Stack.Screen name="ourrecommendation" />
        <Stack.Screen name="paymentmethods" />
        <Stack.Screen name="topupamount" />
        <Stack.Screen name="topupconfirmpin" />
        <Stack.Screen name="topupereceipt" />
        <Stack.Screen name="topupmethods" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;