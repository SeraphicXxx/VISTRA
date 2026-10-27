import "@/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatedSplash } from "@/components/ui/AnimatedSplash";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Poppins_600SemiBold,
    JetBrainsMono_400Regular,
  });
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(patient)" />
        </Stack>

        {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      </View>
    </QueryClientProvider>
  );
}
