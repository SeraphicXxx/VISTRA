import { brand } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const CORE_SIZE = 8;
const WRAP_SIZE = 14;

type LiveDotProps = {
  color?: string;
};

export function LiveDot({ color = brand.primary }: LiveDotProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.ring,
          { backgroundColor: color, transform: [{ scale }], opacity },
        ]}
      />
      <View style={[styles.core, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: WRAP_SIZE,
    height: WRAP_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
  },
  core: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
  },
});
