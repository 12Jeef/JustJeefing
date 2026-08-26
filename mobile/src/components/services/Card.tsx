import { Colors } from "@/constants/theme";
import { Href, router } from "expo-router";
import { LucideProps } from "lucide-react-native";
import { ReactNode, RefAttributes } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { ServiceAttributes } from "./types";

export type CardProps = {
  service: ServiceAttributes;
} & Omit<PressableProps & ViewProps, "children" | "onPress">;

export default function Card({
  service: { href, title, subtitle, icon: Icon },
  style,
  ...etc
}: CardProps) {
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [style, { opacity: pressed ? 0.5 : 1 }]}
      {...etc}
    >
      <View style={[styles.card]}>
        <Icon size={48} color={Colors.fg1} style={[styles.icon]} />
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[styles.subtitle]}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 160,
    backgroundColor: Colors.bg2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: Colors.fg1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: Colors.fg2,
    textAlign: "center",
  },
});
