export type ConnectionState =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED-NOAUTH"
  | "CONNECTED-AUTH";
export type Server = { ip: string; port: number };
