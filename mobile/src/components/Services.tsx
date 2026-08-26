import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import Card from "./services/Card";
import { services } from "./services/types";

export type ServicesProps = {} & Omit<ViewProps, "children">;

export default function Services({ style, ...etc }: ServicesProps) {
  return (
    <View style={[styles.container, style]} {...etc}>
      <Text style={[styles.title]}>Services</Text>
      <View style={[styles.content]}>
        {services.map((service) => (
          <Card key={service.title} service={service} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: Colors.fg1,
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});
