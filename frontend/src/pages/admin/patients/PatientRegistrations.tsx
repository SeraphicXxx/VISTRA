import {useState} from "react";
import {UserPlus} from "lucide-react";
import {usePatientRegistrationsQuery, useReviewPatientRegistration} from "/@/hooks/query/PatientQuery";
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
    const reviewMutation = useReviewPatientRegistration();
    const [actionError, setActionError] = useState<string | null>(null);

    const items: PendingPatient[] = Array.isArray(data) ? data : [];

    const review = async (patientId: string, status: "approved" | "rejected") => {
        setActionError(null);
        try {
            await reviewMutation.mutateAsync({patientId, status});
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Action failed");
        }
    };

    const rowActions = (row: RegistrationTableFormat) => (
        <div className="flex items-center gap-2">
            <button
                className="rounded-xl bg-primary px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                disabled={reviewMutation.isPending}
                onClick={() => review(row.patient_id, "approved")}
            >
                Approve
            </button>
            <button
                className="rounded-xl border border-border px-3 py-1 text-xs font-semibold disabled:opacity-50"
                disabled={reviewMutation.isPending}
                onClick={() => review(row.patient_id, "rejected")}
            >
                Reject
            </button>
        </div>
    );

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Pending Registrations</h1>
            {isError && (
                <p className="text-red-600">
                    {error instanceof Error ? error.message : "Failed to load"}
                </p>
            )}
            {actionError && <p className="text-red-600">{actionError}</p>}
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
            <button className="text-sm text-primary" onClick={() => refetch()}>
                Refresh
            </button>
        </div>
    );
}
