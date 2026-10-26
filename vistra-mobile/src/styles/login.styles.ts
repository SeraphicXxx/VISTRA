import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brand.primaryDark,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 150,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  topHint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  logo: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#ffffff",
  },
  card: {
    flex: 1,
    marginTop: -40,
    backgroundColor: brand.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  cardContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: -60,
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  heading: {
    marginTop: 36,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 26,
    color: brand.primaryDark,
  },
  subheading: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
    color: brand.textMuted,
  },
  form: {
    marginTop: 28,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    color: brand.textMuted,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: brand.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: brand.textPrimary,
    backgroundColor: brand.surface,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: brand.danger,
  },
    eyeButton: {
    position: "absolute",
    right: 14,
    top: 8,
    height: 40,
    justifyContent: "center",
  },
  fieldError: {
    fontSize: 12,
    color: brand.danger,
  },
  formError: {
    textAlign: "center",
    fontSize: 13,
    color: brand.danger,
  },
  button: {
    marginTop: 8,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  helpText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 13,
    color: brand.textMuted,
  },
  helpStrong: {
    color: brand.primaryDark,
    fontWeight: "600",
  },
});
