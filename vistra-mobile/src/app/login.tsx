import { Reveal } from "@/components/animation/Reveal";
import { brand } from "@/constants/theme";
import { loginStyles as styles } from "@/styles/login.styles";
import { validatePassword, validatePatientId } from "@/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "@/hooks/useLogin";
import { ServiceError } from "@/api/service_helpers";

const CAMPUS_BACKGROUND = require("../../assets/images/campus-background.jpg");
const VISTRA_LOGO = require("../../assets/images/vistra-logo.png");

const CARD_DURATION = 700;
const AFTER_CARD = CARD_DURATION + 100;

export default function LoginScreen() {
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const login = useLogin();

  const handleLogin = async () => {
    const id = patientId.trim();

    setErrors({});
    setFormError(null);

    if (!id || !password) {
      setErrors({
        id: !id ? "Patient ID is required" : undefined,
        password: !password ? "Password is required" : undefined,
      });
      return;
    }

    try {
      await login.mutateAsync({ identifier: id, password });

      router.replace("/(patient)/overview");
    } catch (error: unknown) {
      console.error("[LOGIN ERROR]", error);

      if (error instanceof ServiceError) {
        if (error.code === 422 && error.fieldErrors) {
          setErrors(error.fieldErrors);
          return;
        }
        setFormError(error.message || "Login failed");
        return;
      }

      if (error instanceof Error) {
        setFormError(error.message || "Unable to sign in. Please try again.");
        return;
      }

      setFormError("Unable to sign in. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={CAMPUS_BACKGROUND}
        resizeMode="cover"
        style={styles.header}
      >
        <LinearGradient
          colors={["rgba(15,118,110,0.92)", "rgba(20,184,166,0.85)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <Reveal delay={0} distance={12}>
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </Reveal>
      </ImageBackground>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Reveal
          delay={0}
          distance={140}
          duration={CARD_DURATION}
          style={styles.flex}
        >
          <ScrollView
            style={styles.card}
            contentContainerStyle={styles.cardContent}
            keyboardShouldPersistTaps="handled"
          >
            <Reveal delay={AFTER_CARD} distance={20}>
              <View style={styles.logoWrap}>
                <Image
                  source={VISTRA_LOGO}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </Reveal>

            <Reveal delay={AFTER_CARD + 80} distance={16}>
              <Text style={styles.heading}>Welcome Back</Text>
            </Reveal>

            <Reveal delay={AFTER_CARD + 160} distance={12}>
              <Text style={styles.subheading}>
                Enter your Patient ID and password
              </Text>
            </Reveal>

            <View style={styles.form}>
              <Reveal delay={AFTER_CARD + 240} distance={16}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Patient ID</Text>
                  <TextInput
                    value={patientId}
                    onChangeText={setPatientId}
                    placeholder="202XXXXX-S"
                    placeholderTextColor={brand.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.input, errors.id && styles.inputError]}
                  />
                  {errors.id ? (
                    <Text style={styles.fieldError}>{errors.id}</Text>
                  ) : null}
                </View>
              </Reveal>

              <Reveal delay={AFTER_CARD + 320} distance={16}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={brand.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={[
                        styles.input,
                        styles.inputWithIcon,
                        errors.password && styles.inputError,
                      ]}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.eyeButton}
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Ionicons
                        name={
                          showPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color={brand.textMuted}
                      />
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text style={styles.fieldError}>{errors.password}</Text>
                  ) : null}
                </View>
              </Reveal>

              {formError ? (
                <Text style={styles.formError}>{formError}</Text>
              ) : null}

              <Reveal delay={AFTER_CARD + 400} distance={16}>
                <Pressable
                  onPress={handleLogin}
                  disabled={login.isPending}
                  style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
                >
                  <LinearGradient
                    colors={[brand.primaryDark, brand.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, login.isPending && { opacity: 0.7 }]}
                  >
                    {login.isPending ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Sign in</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Reveal>
            </View>

            <Reveal delay={AFTER_CARD + 480} distance={10}>
              <Text style={styles.helpText}>
                Need an account?{" "}
                <Text style={styles.helpStrong}>
                  Visit the clinic front desk
                </Text>
              </Text>
            </Reveal>
          </ScrollView>
        </Reveal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}