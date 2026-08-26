import useServer from "@/hooks/useServer";
import { setConnection } from "@/serverSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkResponse, wait } from "@/util.mobile";
import { useEffect, useRef } from "react";

export type ServerProps = {};

export default function Server({}: ServerProps) {
  const connection = useAppSelector((state) => state.server.connection);

  const dispatch = useAppDispatch();

  const { ip, port } = useServer();
  const ipRef = useRef(ip);
  ipRef.current = ip;
  const portRef = useRef(port);
  portRef.current = port;

  useEffect(() => {
    dispatch(setConnection("DISCONNECTED"));
  }, [ip, port]);

  useEffect(() => {
    if (connection !== "DISCONNECTED" && connection !== "CONNECTED-AUTH")
      return;
    const valid = () => ipRef.current === ip && portRef.current === port;
    const timeout = setTimeout(
      async () => {
        clearTimeout(timeout);
        dispatch(setConnection("CONNECTING"));
        try {
          const resp = await fetch(`http://${ip}:${port}/health`, {
            signal: AbortSignal.timeout(3 * 1e3),
          });
          await checkResponse(resp);
          dispatch(setConnection("CONNECTED-AUTH"));
          return;
        } catch (e) {
          if (!valid()) return;
          if (String(e).toLowerCase().includes("unauth")) {
            dispatch(setConnection("CONNECTED-NOAUTH"));
            return;
          }
          console.error(e);
        }
        if (!valid()) return;
        dispatch(setConnection("DISCONNECTED"));
      },
      (connection === "DISCONNECTED" ? 1 : 30) * 1e3,
    );
    return () => clearTimeout(timeout);
  }, [ip, port, ipRef, portRef, connection]);

  return <></>;
}
