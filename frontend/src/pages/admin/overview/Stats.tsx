import React, { useMemo, useState } from "react";
import {
  STAT_CONFIG,
  StatsGridProps,
  weeklyData,
  visitData,
  StatCard,
} from "/@/utils/statsCard";
import {
  ViewCountUp,
  revealStyle,
  useReveal,
} from "/@/components/adminanim";

type Reveal = ReturnType<typeof useReveal>;

function ChartShell({
  title,
  subtitle,
  reveal,
  children,
}: {
  title: string;
  subtitle: string;
  reveal: Reveal;
  children: React.ReactNode;
}) {
  return (
    <section
      ref={reveal.ref}
      className="hover-lift group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm"
    >
      <div style={revealStyle(reveal.visible, reveal.reduced)}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-textPrimary">
              {title}
            </h3>
            <p className="mt-1 text-xs text-textSecondary">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

function WeeklyAppointments({ data }: { data?: { day: string; value: number }[] }) {
  const rows = useMemo(() => {
    const source = data && data.length > 0 ? data : weeklyData;
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return [...source].sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
  }, [data]);
  const maxValue = Math.max(1, ...rows.map((item) => item.value));
  const reveal = useReveal();
  const { visible, t } = reveal;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ChartShell
      title="Weekly Appointments"
      subtitle="Appointment activity for this week"
      reveal={reveal}
    >
      <div className="mt-8 flex h-52 items-end gap-3">
        {rows.map((item, i) => {
          const pct = (item.value / maxValue) * 100;
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && !isHovered;
          const delay = i * 80;

          return (
            <div
              key={item.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="text-[11px] font-semibold tabular-nums text-textSecondary"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: t(`opacity 0.4s ease ${400 + delay}ms`),
                }}
              >
                <ViewCountUp
                  to={item.value}
                  visible={visible}
                  delay={400 + delay}
                  duration={900}
                />
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-primary/15 hover:bg-primary/25"
                  style={{
                    height: visible ? `${pct}%` : "0%",
                    opacity: isDimmed ? 0.45 : 1,
                    transition: t(
                      `height 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms,
                       opacity 0.25s ease, background-color 0.3s ease`
                    ),
                  }}
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
    </ChartShell>
  );
}

function VisitOverview({ data }: {
  data?: { label: string; value: number; color: string }[];
}) {
  const rows = data && data.length > 0 ? data : visitData;
  const reveal = useReveal();
  const { visible, reduced, t } = reveal;
  const [activeSeg, setActiveSeg] = useState<number | null>(null);

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
    <ChartShell
      title="Visit Overview"
      subtitle="Distribution of today's visits"
      reveal={reveal}
    >
      <div className="mt-7 flex items-center gap-8">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              className="text-background"
            />

            {segments.map(({ item, dash, currentOffset }, i) => {
              const isDimmed = activeSeg !== null && activeSeg !== i;

              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeDasharray={
                    visible
                      ? `${dash} ${circumference - dash}`
                      : `0 ${circumference}`
                  }
                  strokeDashoffset={-currentOffset}
                  className={item.color.replace("bg-", "text-")}
                  onMouseEnter={() => setActiveSeg(i)}
                  onMouseLeave={() => setActiveSeg(null)}
                  style={{
                    opacity: isDimmed ? 0.35 : 1,
                    transition: t(
                      `stroke-dasharray 1s cubic-bezier(0.2, 0.7, 0.2, 1) ${i * 150}ms,
                       opacity 0.25s ease`
                    ),
                  }}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-bold tabular-nums text-textPrimary">
              <ViewCountUp
                to={total}
                visible={visible}
                duration={1100}
                delay={200}
              />
            </span>
            <span className="text-[10px] text-textMuted">Visits</span>
          </div>
        </div>

        <div
          className="flex-1 space-y-3"
          onMouseLeave={() => setActiveSeg(null)}
        >
          {rows.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md px-1 py-0.5 hover:bg-primary/5"
              style={revealStyle(visible, reduced, {
                delay: 0.4 + i * 0.1,
                distance: 10,
                duration: 0.45,
              })}
              onMouseEnter={() => setActiveSeg(i)}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span className="text-xs font-medium text-textSecondary">
                  {item.label}
                </span>
              </div>

              <span className="text-xs font-semibold tabular-nums text-textPrimary">
                <ViewCountUp
                  to={item.value}
                  visible={visible}
                  duration={900}
                  delay={400 + i * 100}
                  suffix="%"
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartShell>
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