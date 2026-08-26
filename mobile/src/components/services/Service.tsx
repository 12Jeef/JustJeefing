import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { ServiceAttributes } from "./types";

export type ServiceProps = {
  service: ServiceAttributes;
} & ViewProps;

export default function Service({
  service: { title, icon: Icon },
  children,
  ...etc
}: ServiceProps) {
  return (
    <View style={[styles.main]} {...etc}>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={[styles.nav]}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.fg1} />
          </Pressable>
          <View style={[styles.navTitle]}>
            <Icon size={24} color={Colors.fg1} />
            <Text style={[styles.title]}>{title}</Text>
          </View>
        </View>
        <View style={[styles.container]}>{children}</View>
      </SafeAreaView>
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
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 8,
    padding: 24,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
  },
  navTitle: {
    flex: 1,
    marginRight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: Colors.fg1,
  },
  container: {
    flex: 1,
  },
});
