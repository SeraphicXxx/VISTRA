import {useMemo} from "react";
import {STAT_CONFIG, StatsGridProps, weeklyData, visitData,StatCard} from "/@/utils/statsCard";


 function WeeklyAppointments({ data }: { data?: { day: string; value: number }[] }) {
  const rows = useMemo(() => {
    const source = data && data.length > 0 ? data : weeklyData;
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return [...source].sort(
      (a, b) => order.indexOf(a.day) - order.indexOf(b.day)
    );
  }, [data]);
  const maxValue = Math.max(1, ...rows.map((item) => item.value));

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <style>
        {`@keyframes chart-bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .chart-bar { animation: none !important; }
        }`}
      </style>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-textPrimary">
            Weekly Appointments
          </h3>

          <p className="mt-1 text-xs text-textSecondary">
            Appointment activity for this week
          </p>
        </div>

      </div>

      <div className="mt-8 flex h-52 items-end gap-3">
        {rows.map((item, index) => {
          const height = `${(item.value / maxValue) * 100}%`;

          return (
            <div
              key={item.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[11px] font-semibold text-textSecondary">
                {item.value}
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="chart-bar w-full origin-bottom rounded-t-lg bg-primary/70"
                  style={{
                    height,
                    animation:
                      "chart-bar-grow 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
                    animationDelay: `${index * 70}ms`,
                  }}
                />
              </div>

              <span className="text-[11px] font-medium text-textMuted">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VisitOverview({ data }: {
  data?: { label: string; value: number; color: string }[];
}) {
  const rows = data && data.length > 0 ? data : visitData;
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    let offset = 0;

    return rows.map((item) => {
      const dash = total > 0 ? (item.value / total) * circumference : 0;
      const currentOffset = offset;

      offset += dash;

      return { item, dash, currentOffset };
    });
  }, [circumference, total, data]);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-textPrimary">
            Visit Overview
          </h3>

          <p className="mt-1 text-xs text-textSecondary">
            Distribution of today's visits
          </p>
        </div>

      </div>

      <div className="mt-7 flex items-center gap-8">
        <div className="relative h-36 w-36 shrink-0">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              className="text-background"
            />

            {segments.map(({ item, dash, currentOffset }) => (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="18"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                className={item.color.replace("bg-", "text-")}
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-bold text-textPrimary">
              {total}
            </span>

            <span className="text-[10px] text-textMuted">
              Visits
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {rows.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                />

                <span className="text-xs font-medium text-textSecondary">
                  {item.label}
                </span>
              </div>

              <span className="text-xs font-semibold text-textPrimary">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function StatsGridSkeleton() {
  return (
    <div
      className="animate-pulse space-y-5"
      aria-busy="true"
      aria-label="Loading overview stats"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <div className="h-3 w-2/3 rounded bg-border" />
            <div className="mt-3 h-8 w-16 rounded bg-border" />
            <div className="mt-4 h-1.5 rounded-full bg-background" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm xl:col-span-2">
          <div className="h-4 w-40 rounded bg-border" />
          <div className="mt-8 flex h-52 items-end gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-t-lg bg-border"
                style={{ height: `${30 + ((i * 37) % 60)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="h-4 w-32 rounded bg-border" />
          <div className="mx-auto mt-7 h-36 w-36 rounded-full bg-border" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 rounded bg-border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsGrid({ stats, weekly, visitMix }: StatsGridProps & {
  weekly?: { day: string; value: number }[];
  visitMix?: { label: string; value: number; color: string }[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CONFIG.map((config) => {
          const data = stats.find((stat) => stat.id === config.id);

          return (
            <StatCard
              key={config.id}
              config={config}
              value={data?.value ?? 0}
              delta={data?.delta}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyAppointments data={weekly} />
        </div>

        <VisitOverview data={visitMix} />
      </div>

    </div>
  );
}