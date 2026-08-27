import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import SplashIcon from "@/components/SplashIcon";
import ServerCard from "@/components/ServerCard";
import Services from "@/components/Services";
import { ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const [showChevron, setShowChevron] = useState(true);

  const chevronStyle1 = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showChevron ? 1 : 0),
      transform: [{ scale: withTiming(showChevron ? 1 : 0.75) }],
    };
  }, [showChevron]);

  const chevronFloat = useSharedValue(0);
  useEffect(() => {
    chevronFloat.value = withRepeat(
      withSequence(
        withTiming(-8, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(8, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
  }, []);
  const chevronStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronFloat.value }],
  }));

  return (
    <View style={[styles.main]}>
      <ScrollView
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setShowChevron(y < Dimensions.get("window").height * 0.25);
        }}
      >
        <SafeAreaView style={[styles.safeArea]}>
          <SplashIcon />
          <Text style={[styles.title]}>
            <Text style={[styles.titlePart1]}>Just</Text>
            {"\n"}
            <Text style={[styles.titlePart2]}>Jeefing</Text>
          </Text>
          <Text style={[styles.subtitle]}>
            A custom iOS app for Jeffrey to handle his own services
          </Text>
          <ServerCard actionable style={[{ alignSelf: "stretch" }]} />
          <Animated.View style={chevronStyle1}>
            <Animated.View style={chevronStyle2}>
              <ChevronDown size={48} color={Colors.fg3} />
            </Animated.View>
          </Animated.View>
          <Services style={[{ marginTop: 64, marginBottom: 512 }]} />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.bg1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    padding: 32,
    paddingTop: 128,
  },
  title: {
    paddingTop: 16,
    textAlign: "center",
    fontSize: 64,
    fontWeight: 800,
    lineHeight: 48,
  },
  titlePart1: {
    color: Colors.fg1,
  },
  titlePart2: {
    color: Colors.accent,
  },
  subtitle: {
    paddingHorizontal: 32,
    textAlign: "center",
    fontSize: 18,
    color: Colors.fg2,
  },
});
