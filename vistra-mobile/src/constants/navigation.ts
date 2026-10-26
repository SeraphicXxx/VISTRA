import type { ComponentProps } from "react";
import { Easing } from "react-native";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type TabIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const TAB_ICONS: Record<string, TabIcon> = {
  overview: "view-grid-outline",
  appointments: "calendar-month-outline",
  medical: "heart-pulse",
  dental: "tooth-outline",
  profile: "account-outline",
};

export const PILL_WIDTH = 76;
export const PILL_HEIGHT = 30;
export const ITEM_TOP = 6;
export const TAB_EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
export const ICON_FADE_MS = 320;
export const INDICATOR_SLIDE_MS = 380;
export const ICON_ACTIVE_SCALE = 1.12;