import React, {useMemo} from "react";
import {useOutletContext} from "react-router-dom";
import {FileText, Stethoscope, Calendar, ChevronRight} from "lucide-react";
import StatsGrid from "./Stats";
import {
    appointmentFilters,
    appointmentFiltersOptions,
    Appointments,
    APPOINTMENTS
} from "/@/pages/admin/appointments/appointmentsData";
import {filterByQuery} from "/@/utils/FilterByQuery.js";
import PanelHeader from "/@/components/OverviewHeader.jsx";
import {
    buildClinicalRecords,
    parseTimeToday,
    DepartmentBadge,
    recordLimit,
} from "/@/components/overviewcmp.jsx";
import {Status, statusLabels} from "/@/components/StatusBadge";
import {CardList} from "/@/components/CardList";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {defaultColumns} from "/@/components/table/Table";
import {HyperlinkText, LinkButton} from "/@/components/Button";
import {ROUTES} from "/@/config/RoutePaths";
interface ConsultationEntry {
    id: string
    student: string
    course: string
    time: string
    type: string
    status: Status
    department: string
}
interface ConsultationCardProps {
    entry: ConsultationEntry;
}

function ConsultationCard({
                              entry,
                          }: ConsultationCardProps) {
    return (
        <>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-textPrimary">
                            {entry.student}
                        </p>

                        <DepartmentBadge
                            department={entry.department}
                        />
                    </div>

                    <p className="mt-0.5 break-words text-xs text-textMuted">
                        {entry.type}
                    </p>
                </div>

                <span className="shrink-0 whitespace-nowrap text-xs font-medium text-textSecondary">
                    {entry.time}
                </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                <FileText
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                />

                {statusLabels[entry.status] ?? entry.status}
            </div>
        </>
    );
}

interface ConsultationsListProps {
    entries: ConsultationEntry[];
}

function ConsultationsList({
                               entries,
                           }: ConsultationsListProps) {
    return (
        <CardList
            items={entries}
            keyExtractor={(entry) => entry.id}
            renderItem={(entry) => (
                <ConsultationCard entry={entry} />
            )}
            emptyState={
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Stethoscope
                            className="h-5 w-5"
                            strokeWidth={2}
                        />
                    </span>

                    <p className="text-sm font-medium text-textPrimary">
                        No consultations yet
                    </p>

                    <p className="text-xs text-textMuted">
                        Walk-ins and clinic visits will show up here as
                        they're checked in.
                    </p>
                </div>
            }
        />
    );
}

interface ConsultationPanelProps {
    filteredRecords: ConsultationEntry[];
}

function ConsultationPanel({
                               filteredRecords,
                           }: ConsultationPanelProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <PanelHeader
                icon={Stethoscope}
                title="Medical & Dental Records"
                subtitle="Live check-in feed"
                action={
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {filteredRecords.length} recent
                    </span>
                }
            />

            <div className="mt-5 max-h-96 overflow-x-auto">
                <ConsultationsList entries={filteredRecords} />
            </div>
        </div>
    );
}

export default function OverviewTab() {
    const {searchQuery} = useOutletContext();

    const clinicalRecords = useMemo(() => buildClinicalRecords(), []);

    const recentRecords = useMemo(() => {
        return [...clinicalRecords]
            .sort((a, b) => parseTimeToday(a.time) - parseTimeToday(b.time))
            .slice(0, recordLimit);
    }, [clinicalRecords]);

    const filteredRecords = useMemo(
        () =>
            filterByQuery(recentRecords, searchQuery, [
                "student",
                "course",
                "type",
                "id",
            ]),
        [searchQuery, recentRecords],
    );
    return (
        <>
            <StatsGrid stats={[]}/>
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ConsultationPanel filteredRecords={filteredRecords}/>
                <DefaultTablePreset<Appointments>
                    title="Appointments"
                    icon={Calendar}
                    filterableColumns={appointmentFilters}
                    filterOptions={appointmentFiltersOptions}
                    data={APPOINTMENTS}
                    columns={defaultColumns}
                    renderAction={
                        (appointment) => (
                            <HyperlinkText
                                title={`View`}
                                link={`${ROUTES.admin.patient.patientRecordTab}/${appointment.id}`}
                                icon={ChevronRight}
                            />
                        )
                    }
                />
            </div>
        </>
    );
}
