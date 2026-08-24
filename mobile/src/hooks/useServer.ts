import { useAppSelector } from "@/store";
import { Server } from "@/types";

export default function useServer(): Server {
  const dev = useAppSelector((state) => state.app.server.dev);
  const ip = dev
    ? "127.0.0.1"
    : (process.env.EXPO_PUBLIC_SERVER_IP ?? "127.0.0.1");
  const port = dev
    ? 3000
    : (parseInt(process.env.EXPO_PUBLIC_SERVER_PORT ?? "3000") ?? 3000);
  return { ip, port };
}
