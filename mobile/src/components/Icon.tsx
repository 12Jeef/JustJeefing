import { Image, ImageProps } from "expo-image";

export type IconProps = { size: number } & ImageProps;

export default function Icon({ size, style, ...etc }: IconProps) {
  return (
    <Image
      {...etc}
      style={[style, { width: size, height: size }]}
      source={require("@/assets/icon.png")}
      contentFit="contain"
    />
  );
}
