import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import SplashIcon from "@/components/SplashIcon";
import ServerCard from "@/components/ServerCard";
import Services from "@/components/Services";

export default function Index() {
  return (
    <View style={[styles.main]}>
      <ScrollView>
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
          <Services />
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
