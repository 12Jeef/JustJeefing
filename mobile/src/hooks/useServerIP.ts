import { useAppSelector } from "@/store";

export default function useServerIP() {
  const dev = useAppSelector((state) => state.app.server.dev);
  return dev ? "127.0.0.1" : process.env.EXPO_PUBLIC_SERVER_IP;
}
