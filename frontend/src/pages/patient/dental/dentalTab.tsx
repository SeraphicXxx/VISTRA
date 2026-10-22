import {Smile} from "lucide-react";
import {StatusBadge} from "/@/components/StatusBadge";
import {VisitTab} from "/@/components/VisitTab";
import {Column, optionsFromValues} from "/@/components/table/Table";
import {sessionManager} from "/@/utils/SessionManager";
import {ROUTES} from "/@/config/RoutePaths";
import {myDentalVisits, DEFAULT_STUDENT_ID, DentalVisit} from "./dentalData";

const treatmentOptions = optionsFromValues(["Filling", "Cleaning", "Checkup"]);

const columns: Column<DentalVisit>[] = [
    {key: "date", label: "Date", filterType: "date"},
    {key: "id", label: "Visit ID"},
    {key: "complaint", label: "Complaint"},
    {key: "doctor", label: "Dentist"},
    {key: "treatmentType", label: "Type", filterType: "select", options: treatmentOptions},
    {key: "treatment", label: "Treatment"},
    {key: "status", label: "Status", render: (value) => <StatusBadge status={value}/>},
];  

const toRow = (visit: DentalVisit) => visit;

const buildViewLink = (visit: DentalVisit) =>
  ROUTES.patient.dental.view.build(visit.id);

export default function PatientDentalTab() {
    const user = sessionManager.getUser();
    const studentId = user?.user_id ?? DEFAULT_STUDENT_ID;
    const visits = myDentalVisits[studentId] ?? [];

    return (
        <VisitTab<DentalVisit, DentalVisit>
            title="My Dental Records"
            icon={Smile}
            columns={columns}
            items={visits}
            toRow={toRow}
            isLoading={false}
            buildViewLink={buildViewLink}
        />
    );
}