import {useState} from "react";
import {UserPlus, Eye} from "lucide-react";
import {usePatientRegistrationsQuery} from "/@/hooks/query/PatientQuery";
import {VisitTab} from "/@/components/VisitTab";
import {registrationColumns, RegistrationTableFormat} from "./registrationData";
import {joinName} from "/@/utils/joinName";

interface PendingPatient {
    patient_id: string;
    registration_status: string;
    PATIENT_PROFILE?: { first_name?: string; last_name?: string; patient_id?: string }[];
}

function toRegistrationTableRow(p: PendingPatient): RegistrationTableFormat {
    const profile = Array.isArray(p.PATIENT_PROFILE) ? p.PATIENT_PROFILE[0] : null;
    const name = profile
        ? joinName([profile.first_name, profile.last_name]) || p.patient_id
        : p.patient_id;

    return {
        id: p.patient_id,
        patient_id: p.patient_id,
        name,
        status: p.registration_status,
    };
}

export default function PatientRegistrations() {
    const {data, isLoading, isError, error, refetch} = usePatientRegistrationsQuery("pending");

    const items: PendingPatient[] = Array.isArray(data) ? data : [];

    const handleView = (patientId: string) => {
        // Placeholder: collaborator will implement the view page.
        console.log("View registration:", patientId);
    };

    const rowActions = (row: RegistrationTableFormat) => (
        <button
            type="button"
            className="rounded-xl border border-border px-3 py-1 text-xs font-semibold text-textPrimary hover:bg-primary/5"
            onClick={() => handleView(row.patient_id)}
        >
            <Eye className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2} />
            View
        </button>
    );

    return (
        <div className="p-6 space-y-4">
            {isError && (
                <p className="text-red-600">
                    {error instanceof Error ? error.message : "Failed to load"}
                </p>
            )}
            <VisitTab
                title="Pending Registrations"
                icon={UserPlus}
                columns={registrationColumns}
                items={items}
                toRow={toRegistrationTableRow}
                isLoading={isLoading}
                renderAction={rowActions}
                showFilters={false}
                showPagination={false}
            />
            {!isLoading && items.length === 0 && (
                <p className="text-textMuted">No pending registrations.</p>
            )}
        </div>
    );
}
