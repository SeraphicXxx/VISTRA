import { brand } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const welcomeStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brand.primaryDark,
  },
  imageArea: {
    flex: 1.2,
    overflow: "hidden",
    backgroundColor: brand.background,
  },
  list: {
    flex: 1,
  },
  slide: {
    flex: 1,
    backgroundColor: brand.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  textBlock: {
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: brand.primaryDark,
  },
  title: {
    marginTop: 4,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
  },
  dots: {
    marginTop: "auto",
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#ffffff",
  },
  button: {
    position: "absolute",
    right: 24,
    bottom: 24,
    minWidth: 140,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: brand.primary,
  },
});
