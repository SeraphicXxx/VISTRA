import { useRef } from "react";
import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";

type PressScaleProps = {
  children: React.ReactNode;
  onPress?: () => void;
  scale?: number;
  style?: StyleProp<ViewStyle>;
};

export function PressScale({
  children,
  onPress,
  scale = 0.96,
  style,
}: PressScaleProps) {
  const value = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(value, {
      toValue,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(scale)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale: value }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
