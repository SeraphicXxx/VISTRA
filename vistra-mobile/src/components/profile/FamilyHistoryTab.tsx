import { FieldGrid, InfoCard, InfoField } from "@/components/profile/ProfileShared";
import type { FamilyHistory } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { View } from "react-native";

export function FamilyHistoryTab(family: FamilyHistory) {
  return (
    <View style={styles.stack}>
      <InfoCard title="Family History & Planning">
        <FieldGrid>
          <InfoField
            label="Family History"
            value={family.family_history.join(", ")}
            full
          />
          <InfoField label="Other Family History" value={family.family_history_others} full />
          <InfoField label="Family Planning Method" value={family.family_planning_method} full />
        </FieldGrid>
      </InfoCard>
    </View>
  );
}