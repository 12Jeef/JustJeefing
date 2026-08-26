import { useState } from "react";
import { View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Icon from "./Icon";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { SplashScreen } from "expo-router";
import { bigIcon, delay, duration, easing } from "@/constants/splash";
import { wait } from "@/util.mobile";

export type SplashOverlayProps = {};

export default function SplashOverlay({}: SplashOverlayProps) {
  const [stage, setStage] = useState(0);

  // create dynamically since we use withCallback
  const kf = new Keyframe({
    0: {
      opacity: 1,
    },
    100: {
      opacity: 0,
      easing,
    },
  }).duration(duration * 1e3);

  return stage === 0 ? (
    <View
      style={[styles.background]}
      onLayout={async () => {
        await SplashScreen.hideAsync();
        await wait(delay);
        setStage(1);
      }}
    >
      <Icon size={bigIcon} />
    </View>
  ) : stage === 1 ? (
    <Animated.View
      style={[styles.background]}
      entering={kf.withCallback((finished) => {
        "worklet";
        if (finished) scheduleOnRN(setStage, 2);
      })}
    >
      <Icon size={bigIcon} />
    </Animated.View>
  ) : null;
}

const styles = StyleSheet.create({
  background: {
    zIndex: 1e3,
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.accent2,
    alignItems: "center",
    justifyContent: "center",
  },
});
