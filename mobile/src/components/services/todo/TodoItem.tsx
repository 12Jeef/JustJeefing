import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import { Item, OnlyDate } from "./types.server";
import { Colors } from "@/constants/theme";
import { compareDates } from "./util.server";
import { Square, SquareCheck, SquareX } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { lockItem, setDays, unlockItem } from "./todoSlice";
import { wait } from "@/util.mobile";

export type TodoItemProps = {
  actionable: boolean;
  item: Item;
  today: OnlyDate;
} & Omit<ViewProps, "children">;

export default function TodoItem({
  actionable: actionableWanted,
  item,
  today,
  style,
  ...etc
}: TodoItemProps) {
  const days = useAppSelector((state) => state.todo.days);
  const locked = useAppSelector((state) =>
    state.todo.lockedItems.includes(item.uuid),
  );

  const dispatch = useAppDispatch();

  const actionable = !locked && actionableWanted;

  const doneToday =
    item.closed !== null && compareDates(item.closed, today) === 0;

  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");

  const lastItemTextRef = useRef<string>(null);
  const lastTextRef = useRef<string>(null);
  useEffect(() => {
    if (locked) return;
    const itemTextChanged = lastItemTextRef.current !== item.text;
    const textChanged = lastTextRef.current !== text;
    if (itemTextChanged) {
      lastItemTextRef.current = item.text;
      lastTextRef.current = item.text;
      setText(item.text);
      return;
    }
    if (textChanged && !focused) {
      lastTextRef.current = text;
      const timeout = setTimeout(async () => {
        dispatch(lockItem(item.uuid));
        await wait(0.5);
        dispatch(
          setDays(
            days.map((day) => ({
              ...day,
              items: day.items.map((i) =>
                i.uuid === item.uuid ? { ...i, text } : i,
              ),
            })),
          ),
        );
        dispatch(unlockItem(item.uuid));
      }, 1.5 * 1e3);
      return () => clearTimeout(timeout);
    }
  }, [locked, focused, item.text, text]);

  return (
    <View style={[styles.item, style]} {...etc}>
      <Pressable
        disabled={!actionable}
        style={({ pressed }) => [
          styles.button,
          { opacity: actionable ? (pressed ? 0.5 : 1) : 0.5 },
        ]}
      >
        {doneToday ? (
          <SquareCheck size={18} color={Colors.green} />
        ) : actionableWanted ? (
          <Square size={18} color={Colors.fg2} />
        ) : (
          <SquareX size={18} color={Colors.red} />
        )}
      </Pressable>
      {actionable ? (
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          submitBehavior="submit"
          onSubmitEditing={() => {
            console.log("CUSTOM ACTION");
          }}
          placeholder="Do something..."
          placeholderTextColor={Colors.fg3}
          style={[styles.text, actionable ? styles.textActionable : undefined]}
        />
      ) : (
        <Text
          style={[styles.text, actionable ? styles.textActionable : undefined]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
  },
  button: {
    marginTop: 4,
  },
  text: {
    marginTop: 2,
    flex: 1,
    fontSize: 18,
    color: Colors.fg3,
  },
  textActionable: {
    marginTop: -3,
    color: Colors.fg2,
  },
});
