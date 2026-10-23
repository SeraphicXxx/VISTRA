import { brand } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

const LOGO_NO_TEXT = require("../../../assets/images/logonotext.png");
const VISTRA_LOGO = require("../../../assets/images/vistra-logo.png");

const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 150;
const RING_SIZE = 200;
const SHRINK_SCALE = 0.75;
const ABSORB_SCALE = 0.5;
const ICON_SHIFT = 65;
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_OUT = Easing.bezier(0.25, 0.1, 0.25, 1);

type AnimatedSplashProps = {
  onFinish: () => void;
  introHold?: number;
  shrinkHold?: number;
  finalHold?: number;
  revealDuration?: number;
};

export function AnimatedSplash({
  onFinish,
  introHold = 700,
  shrinkHold = 150,
  finalHold = 1000,
  revealDuration = 1700,
}: AnimatedSplashProps) {
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.9)).current;
  const iconX = useRef(new Animated.Value(0)).current;
  const revealWidth = useRef(new Animated.Value(0)).current;
  const beatA = useRef(new Animated.Value(0)).current;
  const beatB = useRef(new Animated.Value(0)).current;
  const abstractOpacity = useRef(new Animated.Value(0)).current;
  const abstractDrift = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const beatPulse = Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.05,
        duration: 320,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 0.98,
        duration: 180,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 300,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
    ]);

    const intro = Animated.parallel([
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 800,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      beatPulse,
      Animated.timing(beatA, {
        toValue: 1,
        duration: 1100,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(220),
        Animated.timing(beatB, {
          toValue: 1,
          duration: 1100,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const abstractIn = Animated.timing(abstractOpacity, {
      toValue: 1,
      duration: 1200,
      easing: EASE_OUT,
      useNativeDriver: true,
    });

    const abstractLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(abstractDrift, {
          toValue: 1,
          duration: 3000,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(abstractDrift, {
          toValue: 0,
          duration: 3000,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
    );

    const shrink = Animated.timing(iconScale, {
      toValue: SHRINK_SCALE,
      duration: 500,
      easing: EASE_IN_OUT,
      useNativeDriver: true,
    });

    const slide = Animated.parallel([
      Animated.timing(iconX, {
        toValue: -ICON_SHIFT,
        duration: 700,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: ABSORB_SCALE,
        duration: 700,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }),
    ]);

    const digest = Animated.parallel([
      Animated.timing(revealWidth, {
        toValue: LOGO_WIDTH,
        duration: revealDuration,
        easing: EASE_OUT,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(revealDuration * 0.15),
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: revealDuration * 0.25,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const fadeOut = Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 550,
      easing: EASE_OUT,
      useNativeDriver: true,
    });

    abstractIn.start();
    abstractLoop.start();

    const sequence = Animated.sequence([
      intro,
      Animated.delay(introHold),
      shrink,
      Animated.delay(shrinkHold),
      slide,
      digest,
      Animated.delay(finalHold),
      fadeOut,
    ]);

    sequence.start(({ finished }) => {
      if (finished) onFinish();
    });

    return () => {
      sequence.stop();
      abstractLoop.stop();
      abstractIn.stop();
    };
  }, []);

  const ringScale = (beat: Animated.Value) =>
    beat.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1.5],
    });

  const ringOpacity = (beat: Animated.Value) =>
    beat.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0.5, 0],
    });

  const driftX = abstractDrift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const driftY = abstractDrift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { opacity: screenOpacity }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: abstractOpacity,
            transform: [{ translateX: driftX }, { translateY: driftY }],
          },
        ]}
      >
        <View style={styles.blobTopLeft} />
        <View style={styles.blobBottomRight} />
        <View style={styles.ringTopRight} />
        <View style={styles.dotBottomLeft} />
      </Animated.View>

      <View style={styles.stack}>
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ringOpacity(beatA),
              transform: [{ scale: ringScale(beatA) }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ringOpacity(beatB),
              transform: [{ scale: ringScale(beatB) }],
            },
          ]}
        />

        <Animated.Image
          source={LOGO_NO_TEXT}
          resizeMode="contain"
          style={[
            styles.fill,
            {
              opacity: iconOpacity,
              transform: [{ translateX: iconX }, { scale: iconScale }],
            },
          ]}
        />

        <Animated.View style={[styles.clip, { width: revealWidth }]}>
          <Image
            source={VISTRA_LOGO}
            resizeMode="contain"
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  stack: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: brand.primary,
    top: (LOGO_HEIGHT - RING_SIZE) / 2,
    left: (LOGO_WIDTH - RING_SIZE) / 2,
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  clip: {
    position: "absolute",
    top: 0,
    left: 0,
    height: LOGO_HEIGHT,
    overflow: "hidden",
  },
  blobTopLeft: {
    position: "absolute",
    top: -90,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: brand.primaryLight,
    opacity: 0.45,
  },
  blobBottomRight: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: brand.primary,
    opacity: 0.08,
  },
  ringTopRight: {
    position: "absolute",
    top: 70,
    right: 36,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: brand.primary,
    opacity: 0.25,
  },
  dotBottomLeft: {
    position: "absolute",
    bottom: 110,
    left: 44,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: brand.primary,
    opacity: 0.3,
  },
});
