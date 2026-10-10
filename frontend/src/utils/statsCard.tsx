import {TrendingUp,} from "lucide-react";

export interface StatData {
  id: string;
  value: number;
  delta?: string;
}

export interface StatConfig {
  id: string;
  label: string;
}

export const STAT_CONFIG: StatConfig[] = [
  {
    id: "today",
    label: "Today's Appointments",
  },
  {
    id: "consultations",
    label: "In Consultation",
  },
  {
    id: "records",
    label: "Records Updated",
  },
  {
    id: "activity",
    label: "Active Staff",
  },
];

export interface StatsGridProps {
  stats: StatData[];
}

export const weeklyData = [
  { day: "Mon", value: 18 },
  { day: "Tue", value: 24 },
  { day: "Wed", value: 16 },
  { day: "Thu", value: 29 },
  { day: "Fri", value: 22 },
  { day: "Sat", value: 12 },
];

export const visitData = [
  {
    label: "Medical",
    value: 48,
    color: "bg-primary",
  },
  {
    label: "Dental",
    value: 27,
    color: "bg-primaryDark",
  },
  {
    label: "OJT",
    value: 15,
    color: "bg-height",
  },
  {
    label: "Other",
    value: 10,
    color: "bg-weight",
  },
];


export function StatCard({
  config,
  value,
  delta,
}: {
  config: StatConfig;
  value: number;
  delta?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <p className="text-sm font-medium text-textSecondary">
        {config.label}
      </p>

      <p className="mt-2 font-heading text-3xl font-bold text-textPrimary">
        {value}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-success">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{delta || "No change"}</span>
        </div>

        <span className="text-xs text-textMuted">
          vs yesterday
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-primary/30"
          style={{
            width: `${Math.min(Math.max(value * 3, 15), 90)}%`,
          }}
        />
      </div>
    </div>
  );
}