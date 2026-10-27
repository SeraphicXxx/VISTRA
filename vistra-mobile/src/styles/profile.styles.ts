import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brand.surface,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: brand.textPrimary,
  },
  topSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  hero: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 24,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: brand.primary,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    flex: 1,
    width: "100%",
    borderRadius: 999,
    backgroundColor: brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 26,
    color: "#ffffff",
  },
  heroName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: brand.textPrimary,
    marginTop: 14,
    textAlign: "center",
  },
  heroMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: brand.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  chip: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.background,
  },
  chipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: brand.primaryDark,
  },
  menu: {
    paddingVertical: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 24,
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: brand.textPrimary,
  },
  menuLabelActive: {
    color: brand.primaryDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: brand.border,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: brand.border,
    marginTop: 12,
    marginBottom: 8,
  },
  stack: {
    gap: 20,
    paddingTop: 12,
  },
  card: {
    gap: 12,
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: brand.textPrimary,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  field: {
    width: "48%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
  },
  fieldFull: {
    width: "100%",
  },
  fieldLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: brand.textMuted,
  },
  fieldValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: brand.textPrimary,
    marginTop: 4,
  },
});