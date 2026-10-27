import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const toothChartStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chart: {
    gap: 6,
  },
  archRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  tooth: {
    width: 30,
    alignItems: "center",
    gap: 3,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  toothSelected: {
    borderColor: brand.primary,
    backgroundColor: "rgba(20,184,166,0.12)",
  },
  number: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: 2,
    paddingVertical: 0,
    borderRadius: 3,
    fontFamily: "Inter_600SemiBold",
    fontSize: 5,
    letterSpacing: 0.2,
    color: brand.primary,
    backgroundColor: "rgba(20,184,166,0.1)",
  },
  midline: {
    height: 1,
    marginVertical: 6,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: brand.border,
  },
});