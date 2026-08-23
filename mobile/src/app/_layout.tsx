import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import SplashOverlay from "@/components/SplashOverlay";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <>
      <SplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
