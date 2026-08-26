import { Colors, Fonts } from "@/constants/theme";
import useServer from "@/hooks/useServer";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewProps } from "react-native";
import { Check, Eye, EyeOff, X } from "lucide-react-native";
import Spinner from "./Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import { setConnection, setDev } from "@/serverSlice";
import useAuth from "@/hooks/useAuth";

export type ServerCardProps = { actionable?: boolean } & Omit<
  ViewProps,
  "children"
>;

export default function ServerCard({
  actionable = false,
  style,
  ...etc
}: ServerCardProps) {
  const dev = useAppSelector((state) => state.server.dev);
  const connection = useAppSelector((state) => state.server.connection);

  const dispatch = useAppDispatch();

  const { ip, port } = useServer();
  const { ready, login } = useAuth(() =>
    dispatch(setConnection("DISCONNECTED")),
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [ip, port]);

  return (
    <View style={[style, styles.container]} {...etc}>
      <Text style={[styles.title]}>Server Connection</Text>
      <View style={[styles.subtitle]}>
        <Pressable
          onPress={() => setShow(!show)}
          style={({ pressed }) => [
            styles.ipToggle,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          {show ? (
            <EyeOff size={18} color={Colors.fg2} />
          ) : (
            <Eye size={18} color={Colors.fg2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => dispatch(setDev(!dev))}
          disabled={!actionable}
          style={({ pressed }) => [styles.tag, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.tagText]}>{dev ? "DEV" : "PROD"}</Text>
        </Pressable>
        <Text style={[styles.ip]}>
          {show ? ip + ":" + port : "***.***.***.***:****"}
        </Text>
      </View>
      {!(actionable && connection === "CONNECTED-NOAUTH") && (
        <Text
          style={[
            styles.status,
            {
              color: {
                DISCONNECTED: Colors.red,
                CONNECTING: Colors.accent,
                "CONNECTED-NOAUTH": Colors.yellow,
                "CONNECTED-AUTH": Colors.green,
              }[connection],
            },
          ]}
        >
          {
            {
              DISCONNECTED: "Disconnected",
              CONNECTING: "Connecting...",
              "CONNECTED-NOAUTH": "Not authorized",
              "CONNECTED-AUTH": "Connected",
            }[connection]
          }
        </Text>
      )}
      {actionable && connection === "CONNECTED-NOAUTH" && (
        <Pressable
          disabled={!ready}
          onPress={login}
          style={({ pressed }) => [
            styles.statusAuth,
            { opacity: pressed ? 0.5 : !ready ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.status, { color: Colors.yellow }]}>
            Authorize →
          </Text>
        </Pressable>
      )}
      {connection === "DISCONNECTED" && (
        <X size={24} color={Colors.red} style={[styles.icon]} />
      )}
      {connection === "CONNECTING" && (
        <Spinner size={24} color={Colors.accent} style={[styles.icon]} />
      )}
      {connection === "CONNECTED-NOAUTH" && (
        <X size={24} color={Colors.yellow} style={[styles.icon]} />
      )}
      {connection === "CONNECTED-AUTH" && (
        <Check size={24} color={Colors.green} style={[styles.icon]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
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
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  ipToggle: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tag: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    fontSize: 18,
    color: Colors.fg2,
  },
  ip: {
    fontSize: 18,
    fontFamily: Fonts.mono,
    color: Colors.fg2,
  },
  status: {
    fontSize: 18,
  },
  statusAuth: {},
  icon: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});
