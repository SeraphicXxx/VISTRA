import { TrendingDown, TrendingUp } from "lucide-react";
import {
  ViewCountUp,
  revealStyle,
  useReveal,
} from "/@/components/adminanim";

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
  const reveal = useReveal();
  const { ref, visible, reduced, t } = reveal;

  const deltaText = delta || "No change";
  const isDown = deltaText.trim().startsWith("-");
  const DeltaIcon = isDown ? TrendingDown : TrendingUp;
  const deltaTone = isDown ? "text-red-600" : "text-success";
  const barWidth = Math.min(Math.max(value * 3, 15), 90);

  return (
    <div
      ref={ref}
      className="hover-lift group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm"
    >
      <div style={revealStyle(visible, reduced, { distance: 16 })}>
        <p className="text-sm font-medium text-textSecondary">
          {config.label}
        </p>

        <p className="mt-2 font-heading text-3xl font-bold tabular-nums text-textPrimary">
          <ViewCountUp
            to={value}
            visible={visible}
            delay={150}
            duration={900}
          />
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${deltaTone}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-8px)",
              transition: t(
                "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s"
              ),
            }}
          >
            <DeltaIcon className="h-3.5 w-3.5" />
            <span>{deltaText}</span>
          </div>

          <span className="text-xs text-textMuted">vs yesterday</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-primary/30"
            style={{
              width: visible ? `${barWidth}%` : "0%",
              transition: t(
                "width 1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.45s"
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}