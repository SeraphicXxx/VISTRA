import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const subHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: brand.border,
    shadowColor: "#0f766e",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: brand.textPrimary,
  },
  spacer: {
    width: 42,
  },
});