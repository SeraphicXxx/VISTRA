import {ClipboardList} from "lucide-react";
import {StatusBadge} from "/@/components/StatusBadge";
import {VisitTab} from "/@/components/VisitTab";
import {Column, optionsFromValues} from "/@/components/table/Table";
import {sessionManager} from "/@/utils/SessionManager";
import {ROUTES} from "/@/config/RoutePaths";

import {myMedicalRecords, myVisits, DEFAULT_STUDENT_ID, Visit} from "./medicalData";

const treatmentOptions = optionsFromValues(["Medicine", "Procedure", "Checkup"]);

const columns: Column<Visit>[] = [
    {key: "date", label: "Date", filterType: "date"},
    {key: "id", label: "Visit ID"},
    {key: "complaint", label: "Complaint"},
    {key: "doctor", label: "Doctor"},
    {key: "treatmentType", label: "Type", filterType: "select", options: treatmentOptions},
    {key: "treatment", label: "Treatment"},
    {key: "status", label: "Status", render: (value) => <StatusBadge status={value}/>},
];

const toRow = (visit: Visit) => visit;

const buildViewLink = (visit: Visit) => ROUTES.patient.medical.view.build(visit.id);

export default function PatientMedicalTab() {
    const user = sessionManager.getUser();
    const sessionId = user?.user_id ?? "";
    const studentId = myMedicalRecords[sessionId] ? sessionId : DEFAULT_STUDENT_ID;

    const visits = myVisits[studentId] ?? [];

    if (!myMedicalRecords[studentId]?.recordId) {
        return (
            <div className="mx-auto w-full rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <p className="text-sm text-textMuted">
                    We couldn't find a medical record for your account yet. If you've recently
                    had a clinic visit, check back soon or contact the clinic.
                </p>
            </div>
        );
    }

    return (
        <VisitTab<Visit, Visit>
            title="My Medical Records"
            icon={ClipboardList}
            columns={columns}
            items={visits}
            toRow={toRow}
            isLoading={false}
            buildViewLink={buildViewLink}
        />
    );
}