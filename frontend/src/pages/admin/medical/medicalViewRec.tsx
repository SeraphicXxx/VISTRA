import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  ClipboardList,
  Printer,
  Pencil,
  FileText,
  RefreshCw,
} from "lucide-react";

import { InfoField, getInitials } from "/@/utils/RecordInfo.jsx";
import { EditRecordModal, statusEditFields } from "/@/components/editModal.jsx";
import { StatusBadge } from "/@/components/StatusBadge.jsx";

import { Patient, Visit, visitEditFields } from "/@/types/types";

const examplePatient: Patient = {
  recordId: "MED-1042",
  studentId: "20230810-S",
  name: "Kenji Briones Chua",
  address: "123 Rizal Street",
  barangay: "Barangay San Isidro",
  age: "21",
  mobileNumber: "0917 234 5678",
  sex: "Male",
  birthday: "2004-03-12",
  civilStatus: "Single",
  yearSection: "4th Year - Section A",
  course: "BS Computer Science",
  status: "cleared",
};

// One record = one consultation session, so there is a single visit tied
// to this patient record rather than a dated history of multiple visits.
const exampleVisit: Visit = {
  id: "v1",
  date: "2026-02-14",
  doctor: "Dr. Maria Santos",
  complaint: "Mild fever, headache",
  treatmentType: "Medicine",
  treatment: "Paracetamol 500mg, rest advised",
};

interface PatientRecordViewProps {
  patient?: Patient;
  visit?: Visit;
  onBack?: () => void;
  onSave?: (patient: Patient) => void;
}

export default function PatientRecordView({
  patient = examplePatient,
  visit = exampleVisit,
  onBack,
  onSave,
}: PatientRecordViewProps) {
  const [patientData, setPatientData] = useState<Patient>(patient);
  const [visitData, setVisitData] = useState<Visit>(visit);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isEditingVisit, setIsEditingVisit] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleSaveStatus = (updatedPatient: Patient) => {
    setPatientData(updatedPatient);
    setIsStatusOpen(false);

    if (onSave) {
      onSave(updatedPatient);
    }
  };

  const handleSaveVisit = (updatedVisit: Visit) => {
    setVisitData(updatedVisit);
    setIsEditingVisit(false);
  };

  return (
    <div className="mx-auto w-full">
      {isStatusOpen && (
        <EditRecordModal
          title="Update status"
          fields={statusEditFields}
          data={patientData}
          onClose={() => setIsStatusOpen(false)}
          onSave={handleSaveStatus}
        />
      )}

      {isEditingVisit && (
        <EditRecordModal
          title="Edit visit"
          fields={visitEditFields}
          data={visitData}
          onClose={() => setIsEditingVisit(false)}
          onSave={handleSaveVisit}
        />
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

        <div className="relative p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to records
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsStatusOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white border border-border px-3 py-1.5 text-xs font-medium hover:bg-surfaceMuted"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Update status
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
              >
                <Printer className="h-3.5 w-3.5" />
                Print record
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                {getInitials(patientData.name)}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                    {patientData.name}
                  </h1>

                  <span className="rounded-md bg-surfaceMuted px-2 py-0.5 text-xs text-textMuted">
                    {patientData.recordId}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                  {patientData.studentId && (
                    <span>{patientData.studentId}</span>
                  )}
                  <span>•</span>
                  <span>Medical Record</span>
                </div>
              </div>
            </div>

            <StatusBadge status={patientData.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />

              <h2 className="font-heading text-sm font-semibold text-primaryDark">
                Patient Information
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <InfoField label="Course" value={patientData.course} />
            <InfoField
              label="Year and Section"
              value={patientData.yearSection}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <InfoField label="Age" value={patientData.age} />
            <InfoField label="Sex" value={patientData.sex} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <InfoField label="Civil status" value={patientData.civilStatus} />
            <InfoField label="Birthday" value={patientData.birthday} />
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-5">
            <InfoField
              label="Address"
              value={`${patientData.address}, ${patientData.barangay}`}
            />
            <InfoField
              label="Mobile Number"
              value={patientData.mobileNumber}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-2 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />

              <h2 className="font-heading text-sm font-semibold text-primaryDark">
                Consultation
              </h2>
            </div>

            <span className="text-xs text-textMuted">{visitData.date}</span>
          </div>

          <div className="rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading text-base font-semibold text-primaryDark">
                {visitData.complaint}
              </h3>

              <button
                type="button"
                onClick={() => setIsEditingVisit(true)}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <InfoField label="Attending doctor" value={visitData.doctor} />
              <InfoField
                label="Treatment type"
                value={visitData.treatmentType}
              />
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surfaceMuted/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-textMuted">
                <FileText className="h-3.5 w-3.5" />
                Treatment notes
              </div>
              <p className="text-sm text-textPrimary">
                {visitData.treatment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}