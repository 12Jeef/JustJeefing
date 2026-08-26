import { SERVER_IP, SERVER_PORT } from "@/constants/config";
import { useAppSelector } from "@/store";
import { Server } from "@/types.mobile";

export default function useServer(): Server {
  const dev = useAppSelector((state) => state.server.dev);
  const ip = dev ? "127.0.0.1" : SERVER_IP;
  const port = dev ? 3000 : SERVER_PORT;
  return { ip, port };
}
