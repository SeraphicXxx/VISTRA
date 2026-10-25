import { CLASSIFICATION_LABEL, ID_LABELS } from "@/constants/profile";
import type { PersonalInfo } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { Text, View } from "react-native";

interface ProfileHeaderProps {
  personal: PersonalInfo;
}

export function ProfileHeader({ personal }: ProfileHeaderProps) {
  const initials = personal.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <View style={styles.hero}>
      <View style={styles.avatarRing}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <Text style={styles.heroName} numberOfLines={1}>
        {personal.name}
      </Text>
      <Text style={styles.heroMeta} numberOfLines={1}>
        {ID_LABELS[personal.classification]} {personal.patient_id}
      </Text>

      <View style={styles.chip}>
        <Text style={styles.chipText}>
          {CLASSIFICATION_LABEL[personal.classification]} · {personal.age} yrs · {personal.sex}
        </Text>
      </View>
    </View>
  );
}