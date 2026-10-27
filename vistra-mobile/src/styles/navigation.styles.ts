import { brand } from "@/constants/theme";
import { ITEM_TOP, PILL_HEIGHT, PILL_WIDTH } from "@/constants/navigation";
import { StyleSheet } from "react-native";

export const navigationStyles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },

 header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: 2,
  paddingRight: 16,
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
    width: 76,
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
    fontSize: 9,
    letterSpacing: -0.2,
    color: brand.textMuted,
  },
  labelActive: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: -0.2,
    color: brand.primaryDark,
  },
});

export const motionStyles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: ITEM_TOP,
    left: 0,
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    backgroundColor: "rgba(20,184,166,0.14)",
  },
  iconBox: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    marginTop: ITEM_TOP,
  },
  layer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  labelBox: {
    height: 14,
    alignSelf: "stretch",
  },
  labelLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    textAlign: "center",
  },
});