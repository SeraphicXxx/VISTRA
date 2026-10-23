import { PressScale } from "@/components/animation/PressScale";
import { Reveal } from "@/components/animation/Reveal";
import { LiveDot } from "@/components/ui/LiveDot";
import { brand } from "@/constants/theme";
import { ONBOARDING_SLIDES } from "@/mock/onboarding";
import { welcomeStyles as welcomeScreenStyles } from "@/styles/welcome.styles";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { FlatList, Image, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AUTO_SLIDE_MS = 4000;

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ONBOARDING_SLIDES.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    listRef.current?.scrollToIndex({ index, animated: true });
  }, [index]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(next);
  };

  const slide = ONBOARDING_SLIDES[index];

  return (
    <SafeAreaView edges={["bottom"]} style={welcomeScreenStyles.safe}>
      <StatusBar style="light" />

      <View style={welcomeScreenStyles.imageArea}>
        <FlatList
          ref={listRef}
          data={ONBOARDING_SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          style={welcomeScreenStyles.list}
          renderItem={({ item }) => (
            <View style={[welcomeScreenStyles.slide, { width }]}>
              <Image
                source={item.image}
                style={welcomeScreenStyles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
      </View>

      <LinearGradient
        colors={[brand.primary, brand.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={welcomeScreenStyles.content}
      >
        <View style={welcomeScreenStyles.textBlock}>
          <Reveal key={`badge-${slide.id}`} delay={0} distance={12}>
            <View style={welcomeScreenStyles.badge}>
              <LiveDot />
              <Text style={welcomeScreenStyles.badgeText}>{slide.badge}</Text>
            </View>
          </Reveal>

          <Reveal key={`title-${slide.id}`} delay={150} distance={16}>
            <Text style={welcomeScreenStyles.title}>{slide.title}</Text>
          </Reveal>

          <Reveal key={`subtitle-${slide.id}`} delay={300} distance={16}>
            <Text style={welcomeScreenStyles.subtitle}>{slide.subtitle}</Text>
          </Reveal>
        </View>

        <View style={welcomeScreenStyles.dots}>
          {ONBOARDING_SLIDES.map((item, i) => (
            <View
              key={item.id}
              style={[
                welcomeScreenStyles.dot,
                i === index && welcomeScreenStyles.dotActive,
              ]}
            />
          ))}
        </View>
      </LinearGradient>

      <View style={welcomeScreenStyles.buttonWrap}>
        <Reveal delay={450} distance={20}>
          <PressScale
            onPress={() => router.push("/login")}
            style={welcomeScreenStyles.button}
          >
            <Text style={welcomeScreenStyles.buttonText}>Log in</Text>
          </PressScale>
        </Reveal>
      </View>
    </SafeAreaView>
  );
}
