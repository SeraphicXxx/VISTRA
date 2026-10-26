import {
  HEALTH_RISK_DISCLAIMER,
  type HealthRiskPrediction,
  type RiskLevel,
} from "../healthRisk";

interface HealthRiskPanelProps {
  predictions: HealthRiskPrediction[];
}

const getRiskLevel = (percent: number): RiskLevel => {
  if (percent >= 60) return "high";
  if (percent >= 30) return "moderate";

  return "low";
};

const RISK_STYLES: Record<
  RiskLevel,
  { label: string; text: string; chip: string; bar: string; ring: string; featured: string }
> = {
  low: {
    label: "Low",
    text: "text-primaryDark",
    chip: "bg-primary/10 text-primaryDark",
    bar: "bg-primary",
    ring: "border-primary",
    featured: "border-primary/30 bg-primary/5",
  },
  moderate: {
    label: "Moderate",
    text: "text-amber-700",
    chip: "bg-amber-500/10 text-amber-700",
    bar: "bg-amber-500",
    ring: "border-amber-500",
    featured: "border-amber-300 bg-amber-50",
  },
  high: {
    label: "High",
    text: "text-red-600",
    chip: "bg-red-500/10 text-red-600",
    bar: "bg-red-500",
    ring: "border-red-500",
    featured: "border-red-300 bg-red-50",
  },
};

function FeaturedRisk({ prediction }: { prediction: HealthRiskPrediction }) {
  const style = RISK_STYLES[getRiskLevel(prediction.percent)];

  return (
    <div
      className={`grid gap-6 rounded-2xl border p-6 md:grid-cols-[auto_1fr] md:items-center ${style.featured}`}
    >
      <div
        className={`mx-auto flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-[6px] bg-surface md:mx-0 ${style.ring}`}
      >
        <span className={`font-heading text-3xl font-semibold leading-none ${style.text}`}>
          {prediction.percent}%
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-textMuted">
          {style.label} risk
        </span>
      </div>

      <div className="min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-textMuted">
          Highest risk
        </span>
        <h3 className="mt-1 font-heading text-xl font-semibold text-textPrimary">
          {prediction.condition}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-textSecondary">{prediction.explanation}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {prediction.factors.map((factor) => (
            <span
              key={factor}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-textSecondary"
            >
              {factor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskCard({ prediction }: { prediction: HealthRiskPrediction }) {
  const style = RISK_STYLES[getRiskLevel(prediction.percent)];

  return (
    <div className="flex flex-col rounded-xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-heading text-sm font-semibold text-textPrimary">{prediction.condition}</p>
        <span className={`font-heading text-lg font-semibold leading-none ${style.text}`}>
          {prediction.percent}%
        </span>
      </div>

      <span
        className={`mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.chip}`}
      >
        {style.label} risk
      </span>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${prediction.percent}%` }}
        />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-textSecondary">
        {prediction.explanation}
      </p>

      <p className="mt-auto pt-3 text-xs text-textMuted">{prediction.factors.join(" · ")}</p>
    </div>
  );
}

export default function HealthRiskPanel({ predictions }: HealthRiskPanelProps) {
  const sorted = [...predictions].sort((a, b) => b.percent - a.percent);
  const [top, ...others] = sorted;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7">
      <div>
        <h2 className="font-heading text-sm font-semibold text-primaryDark">Health Risk Prediction</h2>
        <p className="mt-0.5 text-xs text-textMuted">Estimated likelihood based on your records</p>
      </div>

      {top ? (
        <div className="mt-6 flex flex-col gap-4">
          <FeaturedRisk prediction={top} />

          {others.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {others.map((prediction) => (
                <RiskCard key={prediction.condition} prediction={prediction} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-border py-10 text-center text-sm text-textMuted">
          No health risk predictions yet.
        </div>
      )}

      <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-textMuted">
        {HEALTH_RISK_DISCLAIMER}
      </p>
    </div>
  );
}