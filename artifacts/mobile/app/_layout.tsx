import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { ErrorBoundary } from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const gestureStyle = { flex: 1 } as const;

const MODAL_OPTS = { headerShown: false, presentation: "modal" as const };
const CARD_OPTS = { headerShown: false, presentation: "card" as const };
const BASE_OPTS = { headerShown: false };

const RootLayoutNav = React.memo(function RootLayoutNav() {
  return (
    <Stack screenOptions={BASE_OPTS}>
      <Stack.Screen name="(tabs)" options={BASE_OPTS} />
      <Stack.Screen name="catalog/[id]" options={CARD_OPTS} />
      <Stack.Screen name="service-request" options={MODAL_OPTS} />
      <Stack.Screen name="quotation" options={MODAL_OPTS} />
      <Stack.Screen name="amc" options={MODAL_OPTS} />
      <Stack.Screen name="support-ticket" options={MODAL_OPTS} />
    </Stack>
  );
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30 },
        },
      }),
    []
  );

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={gestureStyle}>
            <KeyboardProvider>
              <StatusBar style="auto" />
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
