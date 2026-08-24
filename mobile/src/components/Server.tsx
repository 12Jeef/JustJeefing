import useServer from "@/hooks/useServer";
import { setConnection } from "@/slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { wait } from "@/util";
import { useEffect, useRef } from "react";

export type ServerProps = {};

export default function Server({}: ServerProps) {
  const connection = useAppSelector((state) => state.app.server.connection);

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
          if (!valid()) return;
          const data = await resp.json();
          if (!valid()) return;
          if (!data) throw new Error("Invalid falsy data value");
          if (typeof data !== "object") throw new Error("Invalid data type");
          if (data.success !== true)
            dispatch(setConnection("CONNECTED-NOAUTH"));
          else dispatch(setConnection("CONNECTED-AUTH"));
          return;
        } catch (e) {
          if (!valid()) return;
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
