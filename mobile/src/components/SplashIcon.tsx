import { Colors } from "@/constants/theme";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import Icon from "./Icon";
import {
  bigIcon,
  boom,
  delay,
  duration,
  easing,
  easingBoom,
  smallIcon,
  smallIconContainer,
} from "@/constants/splash";

export type SplashIconProps = {};

export default function SplashIcon({}: SplashIconProps) {
  return (
    <View style={styles.wrapper}>
      <Animated.View entering={kfContainer} style={styles.container} />
      <Animated.View style={styles.boom} entering={kfBoom} />
      <Animated.View style={styles.icon} entering={kfIcon}>
        <Icon size={smallIcon} />
      </Animated.View>
    </View>
  );
}

const initialScale = Dimensions.get("screen").height / 90;
const kfContainer = new Keyframe({
  0: {
    transform: [{ scale: initialScale }],
    backgroundColor: Colors.accent2,
  },
  33: {
    backgroundColor: Colors.accent2,
  },
  100: {
    transform: [{ scale: 1 }],
    backgroundColor: Colors.bg2,
    easing,
  },
})
  .duration(duration * 1e3)
  .delay(delay * 1e3);
const kfBoom = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
    opacity: 1,
  },
  50: {
    transform: [{ scale: 0 }],
    opacity: 1,
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 0,
    easing: easingBoom,
  },
})
  .duration(duration * 1e3)
  .delay(delay * 1e3);
const kfIcon = new Keyframe({
  0: {
    transform: [{ scale: bigIcon / smallIcon }],
    opacity: 0,
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing,
  },
})
  .duration(duration * 1e3)
  .delay(delay * 1e3);

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1e3 - 1,
    width: smallIconContainer,
    height: smallIconContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "absolute",
    width: smallIconContainer,
    height: smallIconContainer,
    backgroundColor: Colors.bg2,
    borderRadius: 60,
  },
  boom: {
    zIndex: -1,
    position: "absolute",
    width: boom,
    height: boom,
    backgroundColor: Colors.accent2,
    borderRadius: boom,
    opacity: 0,
  },
  icon: {
    width: smallIconContainer,
    height: smallIconContainer,
    alignItems: "center",
    justifyContent: "center",
  },
});
