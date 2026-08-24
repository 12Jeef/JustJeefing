import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const SERVER_LOCAL_IP = "127.0.0.1";
export const SERVER_LOCAL_PORT = 3000;

export const SERVER_PUBLIC_IP = process.env.SERVER_IP || "";
export const SERVER_PUBLIC_PORT =
  parseInt(process.env.SERVER_PORT || "3000") || 3000;

export const DATA_DIR = path.join(process.cwd(), "data");

export const GOOGLE_CLIENT_DESKTOP_ID =
  process.env.GOOGLE_CLIENT_DESKTOP_ID || "";
export const GOOGLE_CLIENT_IOS_ID = process.env.GOOGLE_CLIENT_IOS_ID || "";
export const GOOGLE_CLIENT_IDS = [
  GOOGLE_CLIENT_DESKTOP_ID,
  GOOGLE_CLIENT_IOS_ID,
];
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const EMAIL_WHITELIST = (process.env.EMAIL_WHITELIST || "")
  .split("\n")
  .filter((email) => !!email);
export const LOGIN_LASTS_FOR = 30 * 24 * 60 * 60 * 1e3;
