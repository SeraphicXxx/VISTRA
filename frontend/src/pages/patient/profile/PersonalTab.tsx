import type { PersonalInfo } from "./patient.sample";
import {
  FieldGrid,
  ID_LABELS,
  InfoCard,
  InfoField,
  formatDate,
} from "/@/components/ProfileShared";

export default function PersonalTab({
  name,
  classification,
  patient_id,
  birthday,
  age,
  sex,
  civil_status,
  mobile_number,
  address,
  barangay,
  course,
  year,
  section,
  department,
  position,
  onEdit,
}: PersonalInfo & { onEdit?: () => void }) {
  return (
    <div className="space-y-5">
      <InfoCard title="Personal Information" onEdit={onEdit}>
        <FieldGrid>
          <InfoField label="Full Name" value={name} />
          <InfoField label={ID_LABELS[classification]} value={patient_id} />
          <InfoField label="Birthday" value={formatDate(birthday)} />
          <InfoField label="Age" value={age} />
          <InfoField label="Sex" value={sex} />
          <InfoField label="Civil Status" value={civil_status} />
          <InfoField label="Mobile Number" value={mobile_number} />
        </FieldGrid>
      </InfoCard>

      <InfoCard title="Residential Address" onEdit={onEdit}>
        <FieldGrid>
          <InfoField label="Address" value={address} />
          <InfoField label="Barangay" value={barangay} />
        </FieldGrid>
      </InfoCard>

      {classification === "student" && (
        <InfoCard title="Enrollment Details" onEdit={onEdit}>
          <FieldGrid>
            <InfoField label="Course" value={course} />
            <InfoField label="Year Level" value={year} />
            <InfoField label="Section" value={section} />
          </FieldGrid>
        </InfoCard>
      )}

      {classification === "faculty" && (
        <InfoCard title="Employment Details" onEdit={onEdit}>
          <FieldGrid>
            <InfoField label="Department" value={department} />
            <InfoField label="Position" value={position} />
          </FieldGrid>
        </InfoCard>
      )}
    </div>
  );
}