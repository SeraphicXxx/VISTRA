import { formatDate } from "/@/utils/FormatDate";
import type { Visit } from "/@/types/types";

interface VisitTimelineRowProps {
  entry: Visit;
  isLast: boolean;
}

function VisitTimelineRow({ entry, isLast }: VisitTimelineRowProps) {
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <span
          className="absolute left-4 top-9 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}

      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-4 ring-surface">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>

      <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-sm font-medium text-textPrimary">{entry.complaint}</p>
          <span className="font-mono text-[11px] text-textMuted">{formatDate(entry.date)}</span>
        </div>
        <p className="mt-0.5 text-xs text-textMuted">
          {entry.doctor} <span className="mx-1 text-border">·</span> {entry.treatmentType}
        </p>
      </div>
    </div>
  );
}

interface RecentVisitsPanelProps {
  visits: Visit[];
}

export default function RecentVisitsPanel({ visits }: RecentVisitsPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-sm font-semibold text-primaryDark">Recent Visits</h2>
          <p className="mt-0.5 text-xs text-textMuted">Your last clinic check-ins</p>
        </div>

        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {visits.length} recent
        </span>
      </div>

      <div className="mt-6">
        {visits.length > 0 ? (
          visits.map((visit, i) => (
            <VisitTimelineRow key={visit.id} entry={visit} isLast={i === visits.length - 1} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-textMuted">
            No visits yet — your check-ins will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
