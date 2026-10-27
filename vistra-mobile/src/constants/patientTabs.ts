export type TabIconFamily = "ionicons" | "material";

export interface TabConfig {
  routeName: string;
  label: string;
  family: TabIconFamily;
  icon: string;
  activeIcon: string;
}

export const PATIENT_TABS: TabConfig[] = [
  {
    routeName: "overview",
    label: "Home",
    family: "ionicons",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    routeName: "appointments",
    label: "Appointments",
    family: "ionicons",
    icon: "calendar-outline",
    activeIcon: "calendar",
  },
  {
    routeName: "records",
    label: "Records",
    family: "material",
    icon: "file-document-multiple-outline",
    activeIcon: "file-document-multiple",
  },
  {
    routeName: "profile",
    label: "Profile",
    family: "ionicons",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export const TAB_SLIDE_MS = 320;