import { Calculator, Droplets, HeartPulse, LucideIcon, Ruler, Scale, Thermometer } from "lucide-react";
import { formatDate } from "/@/utils/FormatDate";

export interface VitalReadings {
  recordedAt: string;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
}

interface VitalTile {
  key: string;
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}

interface VitalSignsPanelProps {
  vitals: VitalReadings | null;
}

const buildBmi = (weight: number, height: number) => {
  const meters = height / 100;

  return (weight / (meters * meters)).toFixed(1);
};

const buildTiles = (vitals: VitalReadings): VitalTile[] => {
  const tiles: (VitalTile | null)[] = [
    vitals.heartRate != null
      ? {
          key: "hr",
          label: "Heart Rate",
          value: `${vitals.heartRate}`,
          unit: "bpm",
          icon: HeartPulse,
          iconClass: "text-pink-600",
          bgClass: "bg-pink-500/10",
        }
      : null,
    vitals.temperature != null
      ? {
          key: "temp",
          label: "Temperature",
          value: vitals.temperature.toFixed(1),
          unit: "°C",
          icon: Thermometer,
          iconClass: "text-orange-600",
          bgClass: "bg-orange-500/10",
        }
      : null,
    vitals.spo2 != null
      ? {
          key: "spo2",
          label: "SpO₂",
          value: `${vitals.spo2}`,
          unit: "%",
          icon: Droplets,
          iconClass: "text-blue-600",
          bgClass: "bg-blue-500/10",
        }
      : null,
    vitals.weight != null
      ? {
          key: "weight",
          label: "Weight",
          value: `${vitals.weight}`,
          unit: "kg",
          icon: Scale,
          iconClass: "text-indigo-600",
          bgClass: "bg-indigo-500/10",
        }
      : null,
    vitals.height != null
      ? {
          key: "height",
          label: "Height",
          value: `${vitals.height}`,
          unit: "cm",
          icon: Ruler,
          iconClass: "text-teal-600",
          bgClass: "bg-teal-500/10",
        }
      : null,
    vitals.weight != null && vitals.height != null
      ? {
          key: "bmi",
          label: "BMI",
          value: buildBmi(vitals.weight, vitals.height),
          unit: "kg/m²",
          icon: Calculator,
          iconClass: "text-violet-600",
          bgClass: "bg-violet-500/10",
        }
      : null,
  ];

  return tiles.filter((tile): tile is VitalTile => tile !== null);
};

export default function VitalSignsPanel({ vitals }: VitalSignsPanelProps) {
  const tiles = vitals ? buildTiles(vitals) : [];
  const isOddCount = tiles.length % 2 === 1;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7">
      <div>
        <h2 className="font-heading text-sm font-semibold text-primaryDark">Vital Signs</h2>
        <p className="mt-0.5 text-xs text-textMuted">
          {vitals ? `Recorded ${formatDate(vitals.recordedAt)}` : "No readings yet"}
        </p>
      </div>

      {tiles.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            const isLastOdd = isOddCount && index === tiles.length - 1;

            return (
              <div
                key={tile.key}
                className={`rounded-xl border border-border bg-background p-4 ${isLastOdd ? "col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-textMuted">
                    {tile.label}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${tile.bgClass} ${tile.iconClass}`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-3 font-heading text-xl font-semibold text-textPrimary">
                  {tile.value}
                  <span className="ml-1 text-xs font-medium text-textMuted">{tile.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border py-10 text-center text-sm text-textMuted">
          No vital signs recorded yet. Measurements from your next check-up will appear here.
        </div>
      )}
    </div>
  );
}