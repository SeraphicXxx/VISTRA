import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const tabBarStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 28,
    backgroundColor: brand.primaryDark,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: 50,
    backgroundColor: brand.surface,
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,
  },
  pill: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 74,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  pillActive: {
    backgroundColor: brand.surface,
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: -0.2,
  },
});