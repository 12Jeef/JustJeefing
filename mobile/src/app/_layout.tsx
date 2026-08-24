import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import SplashOverlay from "@/components/SplashOverlay";
import { store } from "@/store";
import Server from "@/components/Server";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <Provider store={store}>
      <Server />

      <SplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
