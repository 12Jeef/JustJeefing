import { Day } from "./types.mobile";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { Colors } from "@/constants/theme";

export type TodoDayProps = { day: Day } & Omit<ViewProps, "children">;

export default function TodoDay({ day, style, ...etc }: TodoDayProps) {
  return (
    <View style={[styles.card, style]} {...etc}>
      <Text style={[styles.title]}>{day.date.join("/")}</Text>
      {day.items.map((item, i) => (
        <Text key={item.uuid} style={[styles.item]}>
          {item.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.bg2,
    borderRadius: 16,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: Colors.fg1,
  },
  item: {
    fontSize: 18,
    color: Colors.fg2,
  },
});
