import { FieldGrid, InfoCard, InfoField, formatOptionalDate } from "@/components/profile/ProfileShared";
import type { MedicalHistory } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { View } from "react-native";

export function MedicalHistoryTab(medical: MedicalHistory) {
  return (
    <View style={styles.stack}>
      <InfoCard title="Medical History">
        <FieldGrid>
          <InfoField label="Hospitalization / Operation Year" value={medical.hospitalization_year} full />
          <InfoField label="Diagnosis" value={medical.diagnosis} full />
          <InfoField label="Medication Allergies" value={medical.allergy_medicine} />
          <InfoField label="Food Allergies" value={medical.allergy_food} />
          <InfoField label="Smoking" value={medical.smoking} />
          <InfoField label="Vaping" value={medical.vaping} />
          <InfoField label="Alcohol Intake" value={medical.alcohol_intake} />
          <InfoField label="Last Menstrual Period" value={formatOptionalDate(medical.last_menstrual_period)} />
        </FieldGrid>
      </InfoCard>
    </View>
  );
}