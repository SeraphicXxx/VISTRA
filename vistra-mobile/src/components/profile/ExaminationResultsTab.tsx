import { FieldGrid, InfoCard, InfoField, formatOptionalDate } from "@/components/profile/ProfileShared";
import type { ExaminationResults } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { View } from "react-native";

export function ExaminationResultsTab(results: ExaminationResults) {
  return (
    <View style={styles.stack}>
      <InfoCard title="Examination Results">
        <FieldGrid>
          <InfoField label="Chest X-Ray" value={results.chest_xray} />
          <InfoField label="CBC" value={results.cbc} />
          <InfoField label="Urinalysis" value={results.urinalysis} />
          <InfoField label="Examination Date" value={formatOptionalDate(results.examination_date)} />
          <InfoField label="Examining Physician" value={results.examining_physician} full />
          <InfoField label="Recommendations" value={results.recommendation} full />
        </FieldGrid>
      </InfoCard>
    </View>
  );
}