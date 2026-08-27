import { Day } from "./types.mobile";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { Colors } from "@/constants/theme";
import TodoItem from "./TodoItem";

export type TodoDayProps = { actionable: boolean; day: Day } & Omit<
  ViewProps,
  "children"
>;

export default function TodoDay({
  actionable,
  day,
  style,
  ...etc
}: TodoDayProps) {
  return (
    <View
      style={[
        styles.card,
        actionable ? styles.cardActionable : undefined,
        style,
      ]}
      {...etc}
    >
      <View style={[styles.titleBar]}>
        <Text
          style={[
            styles.title,
            actionable ? styles.titleActionable : undefined,
          ]}
        >
          {day.date.join("/")}
        </Text>
      </View>
      <View style={[styles.items]}>
        {day.items.map((item) => (
          <TodoItem
            key={item.uuid}
            actionable={actionable}
            item={item}
            today={day.date}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 32,
    marginBottom: 32,
    padding: 24,
    backgroundColor: Colors.bg2 + "80",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.bg2,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 16,
  },
  cardActionable: {
    backgroundColor: Colors.bg2,
    borderColor: Colors.bg3,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: Colors.fg2,
  },
  titleActionable: {
    color: Colors.fg1,
  },
  items: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 8,
  },
});
