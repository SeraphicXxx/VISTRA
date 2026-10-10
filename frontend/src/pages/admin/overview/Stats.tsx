import {STAT_CONFIG, StatsGridProps, weeklyData, visitData,StatCard} from "/@/utils/statsCard";


 function WeeklyAppointments() {
  const maxValue = Math.max(...weeklyData.map((item) => item.value));

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
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
        {weeklyData.map((item) => {
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
                  className="w-full rounded-t-lg bg-primary/15 transition-all duration-300 hover:bg-primary/25"
                  style={{ height }}
                >
                  <div className="h-full w-full rounded-t-lg bg-primary/70" />
                </div>
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

function VisitOverview() {
  const total = visitData.reduce((sum, item) => sum + item.value, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

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

            {visitData.map((item) => {
              const percentage = item.value / total;
              const dash = percentage * circumference;
              const currentOffset = offset;

              offset += dash;

              return (
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
              );
            })}
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
          {visitData.map((item) => (
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


export default function StatsGrid({ stats }: StatsGridProps) {
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
          <WeeklyAppointments />
        </div>

        <VisitOverview />
      </div>

    </div>
  );
}