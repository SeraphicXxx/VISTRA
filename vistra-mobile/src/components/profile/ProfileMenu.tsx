import { PROFILE_TABS } from "@/constants/profile";
import { brand } from "@/constants/theme";
import type { ProfileTabId } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";
import { Pressable, Text, View } from "react-native";

interface ProfileMenuProps {
  active: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
}

export function ProfileMenu({ active, onChange }: ProfileMenuProps) {
  return (
    <View style={styles.menu}>
      {PROFILE_TABS.map((tab, index) => {
        const isActive = tab.id === active;

        return (
          <Fragment key={tab.id}>
            {index > 0 && <View style={styles.menuDivider} />}
            <Pressable
              onPress={() => onChange(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.menuRow}>
                <View style={styles.menuIcon}>
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={isActive ? brand.primaryDark : brand.textSecondary}
                  />
                </View>
                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                  {tab.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isActive ? brand.primary : brand.textMuted}
                />
              </View>
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
}