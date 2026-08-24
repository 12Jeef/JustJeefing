import { Colors, Fonts } from "@/constants/theme";
import useServerIP from "@/hooks/useServerIP";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import { Eye, EyeOff, X } from "lucide-react-native";
import Spinner from "./Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import { setDev } from "@/slice";

export type ServerCardProps = {} & ViewProps;

export default function ServerCard({ style, ...etc }: ServerCardProps) {
  const [showIP, setShowIP] = useState(false);
  const serverIP = useServerIP();
  useEffect(() => {
    setShowIP(false);
  }, [serverIP]);

  const dev = useAppSelector((state) => state.app.server.dev);
  const connection = useAppSelector((state) => state.app.server.connection);

  const dispatch = useAppDispatch();

  return (
    <View style={[style, styles.container]} {...etc}>
      <Text style={[styles.title]}>Server Connection</Text>
      <View style={[styles.subtitle]}>
        <Pressable
          onPress={() => setShowIP(!showIP)}
          style={({ pressed }) => [
            styles.ipToggle,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          {showIP ? (
            <EyeOff size={14} color={Colors.fg2} />
          ) : (
            <Eye size={14} color={Colors.fg2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => dispatch(setDev(!dev))}
          style={({ pressed }) => [styles.tag, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.tagText]}>
            {dev ? "Development" : "Production"}
          </Text>
        </Pressable>
        <Text style={[styles.ip]}>{showIP ? serverIP : "***.***.***.***"}</Text>
      </View>
      {connection === "DISCONNECTED" && (
        <X size={32} color={Colors.red} style={[styles.icon]} />
      )}
      {connection === "CONNECTING" && (
        <Spinner size={32} color={Colors.accent} style={[styles.icon]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.bg2,
    borderRadius: 8,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    color: Colors.fg1,
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  ipToggle: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  tag: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    fontSize: 14,
    color: Colors.fg2,
  },
  ip: {
    fontSize: 14,
    fontFamily: Fonts.mono,
    color: Colors.fg2,
    width: 136,
  },
  icon: {
    position: "absolute",
    top: "50%",
    right: 16,
  },
});
