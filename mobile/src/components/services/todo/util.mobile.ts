import { Colors } from "@/constants/theme";
import { Color } from "./types.server";

export const getColor = (color: Color): string =>
  ({
    R: Colors.red,
    O: Colors.orange,
    Y: Colors.yellow,
    G: Colors.green,
    B: Colors.blue,
    P: Colors.purple,
    M: Colors.magenta,
  })[color];
