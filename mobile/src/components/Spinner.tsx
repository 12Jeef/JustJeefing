import { Colors } from "@/constants/theme";
import { useEffect } from "react";
import { ColorValue, StyleSheet, View, ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const viewportSize = 100;
const halfViewportSize = viewportSize / 2;
const thickness = viewportSize * 0.1;
const radius = halfViewportSize - thickness / 2;

const project = (angle: number) => {
  "worklet";
  const radians = (angle - 90) * (Math.PI / 180);
  return {
    x: halfViewportSize + radius * Math.cos(radians),
    y: halfViewportSize + radius * Math.sin(radians),
  };
};
const arc = (start: number, stop: number) => {
  "worklet";
  const startXY = project(stop);
  const stopXY = project(start);
  const angle = stop - start;
  const largeArcFlag = angle <= 180 ? 0 : 1;
  return `
    M ${startXY.x} ${startXY.y}
    A ${radius} ${radius}
      0 ${largeArcFlag} 0
      ${stopXY.x} ${stopXY.y}
  `;
};

export type SpinnerProps = { size: number; color?: ColorValue } & Omit<
  ViewProps,
  "children"
>;

export default function Spinner({ size, color, style, ...etc }: SpinnerProps) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1.5 * 1e3,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);
  const animatedProps = useAnimatedProps(() => {
    const t = progress.value;
    const start = t * 360;
    const length = 135 + 90 * ((1 - Math.cos(t * Math.PI * 2)) / 2);
    return {
      d: arc(start, start + length),
    };
  }, [progress]);

  return (
    <View style={[style, styles.main, { width: size, height: size }]} {...etc}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewportSize} ${viewportSize}`}
      >
        <AnimatedPath
          animatedProps={animatedProps}
          fill="none"
          stroke={color ?? Colors.fg1}
          strokeWidth={thickness}
          strokeLinecap="square"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
});
