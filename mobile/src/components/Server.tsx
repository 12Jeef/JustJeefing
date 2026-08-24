import useServer from "@/hooks/useServer";
import { setConnection } from "@/slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { wait } from "@/util";
import { useEffect } from "react";

export type ServerProps = {};

export default function Server({}: ServerProps) {
  const connection = useAppSelector((state) => state.app.server.connection);

  const dispatch = useAppDispatch();

  const { ip, port } = useServer();

  useEffect(() => {
    dispatch(setConnection("DISCONNECTED"));
  }, [ip, port]);

  useEffect(() => {
    if (connection !== "DISCONNECTED") return;
    const timeout = setTimeout(async () => {
      clearTimeout(timeout);
      dispatch(setConnection("CONNECTING"));
      try {
        const resp = await fetch(`http://${ip}:${port}/health`, {
          signal: AbortSignal.timeout(3 * 1e3),
        });
        const data = await resp.json();
        if (!data) throw new Error("Invalid falsy data value");
        if (typeof data !== "object") throw new Error("Invalid data type");
        if (data.success !== true) throw new Error("Not successful");
        dispatch(setConnection("CONNECTED"));
        return;
      } catch (e) {
        console.error(e);
      }
      dispatch(setConnection("DISCONNECTED"));
    }, 3 * 1e3);
    return () => clearTimeout(timeout);
  }, [ip, port, connection]);

  return <></>;
}
