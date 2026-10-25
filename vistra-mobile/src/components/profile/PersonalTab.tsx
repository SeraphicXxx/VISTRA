import { FieldGrid, InfoCard, InfoField, formatOptionalDate } from "@/components/profile/ProfileShared";
import type { PersonalInfo } from "@/mock/profile";
import { profileStyles as styles } from "@/styles/profile.styles";
import { View } from "react-native";

export function PersonalTab(personal: PersonalInfo) {
  return (
    <View style={styles.stack}>
      <InfoCard title="Personal Information">
        <FieldGrid>
          <InfoField label="Full Name" value={personal.name} full />
          <InfoField label="Birthday" value={formatOptionalDate(personal.birthday)} />
          <InfoField label="Age" value={personal.age} />
          <InfoField label="Sex" value={personal.sex} />
          <InfoField label="Civil Status" value={personal.civil_status} />
          <InfoField label="Mobile Number" value={personal.mobile_number} />
        </FieldGrid>
      </InfoCard>

      <InfoCard title="Residential Address">
        <FieldGrid>
          <InfoField label="Address" value={personal.address} full />
          <InfoField label="Barangay" value={personal.barangay} />
        </FieldGrid>
      </InfoCard>

      {personal.classification === "student" && (
        <InfoCard title="Enrollment Details">
          <FieldGrid>
            <InfoField label="Course" value={personal.course} full />
            <InfoField label="Year Level" value={personal.year} />
            <InfoField label="Section" value={personal.section} />
          </FieldGrid>
        </InfoCard>
      )}

      {personal.classification === "faculty" && (
        <InfoCard title="Employment Details">
          <FieldGrid>
            <InfoField label="Department" value={personal.department} full />
            <InfoField label="Position" value={personal.position} full />
          </FieldGrid>
        </InfoCard>
      )}
    </View>
  );
}