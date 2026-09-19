export const statusConfig = {
  completed: {
    label: "Completed",
    className: "border-success/30 bg-success/10 text-success",
  },

  followUp: {
    label: "Follow-up",
    className: "border-warning/30 bg-warning/10 text-warning",
  },

  referred: {
    label: "Referred",
    className: "border-info/30 bg-info/10 text-info",
  },

  ongoingTreatment: {
    label: "Ongoing Treatment",
    className: "border-treatment/30 bg-treatment/10 text-treatment",
  },

  confirmed: {
    label: "Confirmed",
    className: "border-primary/30 bg-primary/10 text-primary",
  },

  pending: {
    label: "Pending",
    className: "border-warning/30 bg-warning/10 text-warning",
  },

  declined: {
    label: "Declined",
    className: "border-danger/30 bg-danger/10 text-danger",
  },

  cleared: {
    label: "Cleared",
    className: "border-success/30 bg-success/10 text-success",
  },

  secondOpinion: {
    label: "Second Opinion",
    className: "border-warning/30 bg-warning/10 text-warning",
  },

  recovered: {
    label: "Recovered",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
} as const;

export const statusLabels = {
  completed: "Completed",
  followUp: "Follow-up",
  referred: "Referred",
  ongoingTreatment: "Ongoing Treatment",
  confirmed: "Confirmed",
  pending: "Pending",
  declined: "Declined",
  cleared: "Cleared",
  secondOpinion: "Second Opinion",
  recovered: "Recovered",
} as const;

export type Status = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
      <span
          className={`
                inline-flex
                items-center
                rounded-full
                border
                px-2.5
                py-1
                text-xs
                font-medium
                ${className}
            `}
      >
            {label}
        </span>
  );
}

