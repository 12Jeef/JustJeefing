export const SERVER_LOCAL_IP = "127.0.0.1";
export const SERVER_LOCAL_PORT = 3000;

export const SERVER_PUBLIC_IP = process.env.SERVER_IP || "";
export const SERVER_PUBLIC_PORT =
  parseInt(process.env.SERVER_PORT || "3000") || 3000;
