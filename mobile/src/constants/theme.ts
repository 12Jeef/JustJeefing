import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  bg1: "#101224",
  bg2: "#26294a",
  bg3: "#414673",
  fg1: "#ffffff",
  fg2: "#c1c4db",
  fg3: "#8488a3",
  accent: "#03fca5",
  accent2: "#098056",
  red: "#ff0048",
  yellow: "#ffb300",
  green: "#03fca5",
} as const;

export const Fonts = Platform.select({
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
});
