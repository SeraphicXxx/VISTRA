import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const recordsStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    color: brand.primaryDark,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: brand.textMuted,
  },

  segmented: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: brand.border,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: brand.surface,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: brand.textMuted,
  },
  segmentTextActive: {
    color: brand.primaryDark,
  },
  segmentCount: {
    marginTop: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: brand.textMuted,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  count: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: brand.textMuted,
  },
  sortWrap: {
    position: "relative",
    zIndex: 20,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
  },
  sortText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: brand.primaryDark,
  },
  sortMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 220,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    zIndex: 20,
    elevation: 10,
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sortOptionActive: {
    backgroundColor: "rgba(20,184,166,0.1)",
  },
  sortOptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: brand.textPrimary,
  },
  sortOptionTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: brand.primaryDark,
  },
  pressed: {
    opacity: 0.88,
  },

  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
  },
  dateBlock: {
    width: 56,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(20,184,166,0.1)",
  },
  dateDay: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: brand.primaryDark,
  },
  dateMonth: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: brand.primary,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardType: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: brand.textPrimary,
  },
  cardMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: brand.textMuted,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },

  emptyCard: {
    alignItems: "center",
    gap: 6,
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: brand.border,
    backgroundColor: brand.surface,
  },
  emptyTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: brand.textPrimary,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: brand.textMuted,
    textAlign: "center",
  },
});