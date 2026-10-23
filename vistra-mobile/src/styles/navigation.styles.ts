import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const navigationStyles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#ffff",
  },
  headerLogo: {
    width: 120,
    height: 36,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: brand.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f766e",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bellBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: brand.danger,
    borderWidth: 2,
    borderColor: brand.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "#ffffff",
  },

  bar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingTop: 0,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  pill: {
    paddingTop: 6,
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: {
    paddingTop: 6,
    backgroundColor: "transparent",
    borderTopWidth: 2,
    borderColor: brand.primaryDark,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: brand.textMuted,
  },
  labelActive: {
    fontFamily: "Inter_600SemiBold",
    color: brand.primaryDark,
  },
});