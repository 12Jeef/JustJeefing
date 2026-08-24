import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import SplashIcon from "@/components/SplashIcon";
import ServerCard from "@/components/ServerCard";

export default function Index() {
  return (
    <View style={[styles.main]}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.bg1,
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    padding: 32,
  },
  title: {
    paddingTop: 12,
    textAlign: "center",
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 36,
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
    fontSize: 16,
    color: Colors.fg2,
  },
});
