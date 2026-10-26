import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const healthRiskStyles = StyleSheet.create({
  stack: {
    gap: 14,
    paddingTop: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  condition: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: brand.textPrimary,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  probRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  probValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 28,
  },
  probLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: brand.textMuted,
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: brand.background,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  sectionLabel: {
    marginTop: 4,
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: brand.textMuted,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  factorList: {
    gap: 8,
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  factorText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: brand.textPrimary,
  },
  recBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: brand.background,
    gap: 4,
  },
  recLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: brand.primaryDark,
  },
  recText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: brand.textPrimary,
  },
  footer: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: brand.textMuted,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  empty: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: brand.textMuted,
  },
});