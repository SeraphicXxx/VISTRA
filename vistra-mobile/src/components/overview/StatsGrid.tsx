import { Reveal } from "@/components/animation/Reveal";
import { brand } from "@/constants/theme";
import type { Appointment } from "@/mock/overview";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

const ACCENTS = {
  sky: { bg: "rgba(14,165,233,0.12)", text: "#0284c7" },
  violet: { bg: "rgba(139,92,246,0.12)", text: "#7c3aed" },
  emerald: { bg: "rgba(16,185,129,0.12)", text: "#059669" },
  amber: { bg: "rgba(245,158,11,0.12)", text: "#d97706" },
};

type Accent = (typeof ACCENTS)[keyof typeof ACCENTS];

interface Stat {
  id: string;
  label: string;
  value: string;
  delta: string;
  icon: IconName;
  accent: Accent;
}

interface StatsGridProps {
  nextAppointment: Appointment | null;
  visitCount: number;
  medicalStatus?: string;
  dentalStatus?: string;
  startDelay?: number;
}

const CARD_STAGGER = 110;

function buildStats({
  nextAppointment,
  visitCount,
  medicalStatus,
  dentalStatus,
}: StatsGridProps): Stat[] {
  return [
    {
      id: "next-appointment",
      label: "Next Appointment",
      value: nextAppointment ? formatDate(nextAppointment.date) : "None scheduled",
      delta: nextAppointment
        ? `${nextAppointment.type} · ${nextAppointment.time}`
        : "Book one anytime",
      icon: "calendar-outline",
      accent: ACCENTS.sky,
    },
    {
      id: "visits",
      label: "Total Visits",
      value: String(visitCount),
      delta: "Logged to your record",
      icon: "medkit-outline",
      accent: ACCENTS.violet,
    },
    {
      id: "medical",
      label: "Medical Status",
      value: medicalStatus || "No record yet",
      delta: "Clinic clearance",
      icon: "shield-checkmark-outline",
      accent: ACCENTS.emerald,
    },
    {
      id: "dental",
      label: "Dental Status",
      value: dentalStatus || "No record yet",
      delta: "Clinic clearance",
      icon: "clipboard-outline",
      accent: ACCENTS.amber,
    },
  ];
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel} numberOfLines={1}>
          {stat.label}
        </Text>
        <View style={[styles.statIcon, { backgroundColor: stat.accent.bg }]}>
          <Ionicons name={stat.icon} size={16} color={stat.accent.text} />
        </View>
      </View>
      <Text style={styles.statValue} numberOfLines={1}>
        {stat.value}
      </Text>
      <Text style={styles.statDelta} numberOfLines={1}>
        {stat.delta}
      </Text>
    </View>
  );
}

export function StatsGrid(props: StatsGridProps) {
  const { startDelay = 0 } = props;
  const stats = buildStats(props);

  return (
    <View style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <Reveal
          key={stat.id}
          delay={startDelay + index * CARD_STAGGER}
          distance={18}
          style={styles.statSlot}
        >
          <StatCard stat={stat} />
        </Reveal>
      ))}
    </View>
  );
}