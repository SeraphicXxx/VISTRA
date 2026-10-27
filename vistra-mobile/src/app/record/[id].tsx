import { Reveal } from "@/components/animation/Reveal";
import { SubHeader } from "@/components/navigation/SubHeader";
import { brand } from "@/constants/theme";
import { RECORD_DETAILS } from "@/mock/recordDetails";
import { PATIENT_RECORDS, type RecordStatus } from "@/mock/records";
import { recordDetailStyles as styles } from "@/styles/recordDetail.styles";
import { formatDate } from "@/utils/dates";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const STATUS_META: Record<RecordStatus, { label: string; color: string; background: string }> = {
  "in-progress": { label: "In progress", color: "#d97706", background: "#fef3c7" },
  "follow-up": { label: "Follow-up", color: brand.textSecondary, background: brand.border },
  completed: { label: "Completed", color: brand.primaryDark, background: "rgba(20,184,166,0.12)" },
};

const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.specRow, last && styles.specRowLast]}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function MedicalRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = PATIENT_RECORDS.find((r) => r.id === id && r.kind === "medical");

  if (!record) {
    return (
      <View style={styles.safe}>
        <SubHeader title="Medical Record" backTo="/(patient)/records" />
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No record found</Text>
          <Text style={styles.emptyText}>This record may have been removed.</Text>
        </View>
      </View>
    );
  }

  const detail = RECORD_DETAILS[record.id];
  const status = STATUS_META[record.status];

  const latestVisit = PATIENT_RECORDS.filter((r) => r.kind === "medical").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
  const isLatest = latestVisit.id === record.id;

  return (
    <View style={styles.safe}>
      <SubHeader title="Medical Record" backTo="/(patient)/records" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal delay={0} distance={14}>
          <View style={styles.header}>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}>MEDICAL RECORD</Text>
            </View>
            <Text style={styles.pageTitle}>{record.title}</Text>

            <View style={styles.doctorRow}>
              <View style={styles.doctorAvatar}>
                <Text style={styles.doctorAvatarText}>{initialsOf(record.doctor)}</Text>
              </View>
              <View style={styles.doctorBody}>
                <Text style={styles.doctorName}>{record.doctor}</Text>
                <Text style={styles.metaText}>{formatDate(record.date)}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: status.background }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
          </View>
        </Reveal>

        <Reveal delay={60} distance={14}>
          <View style={styles.lastVisit}>
            <View>
              <Text style={styles.lastVisitLabel}>LAST VISIT</Text>
              <Text style={styles.lastVisitValue}>{formatDate(latestVisit.date)}</Text>
            </View>
            {isLatest ? (
              <View style={[styles.lastVisitChip, styles.lastVisitChipCurrent]}>
                {/* <Text style={[styles.lastVisitChipText, styles.lastVisitChipTextCurrent]}>
                  Viewing
                </Text> */}
              </View>
            ) : (
              <Pressable
                onPress={() => router.push(`/record/${latestVisit.id}`)}
                style={({ pressed }) => [styles.lastVisitChip, pressed && styles.pressed]}
              >
                <Text style={styles.lastVisitChipText}>Open latest</Text>
              </Pressable>
            )}
          </View>
        </Reveal>

        <Reveal delay={120} distance={14}>
          <View style={styles.diagnosisCard}>
            <View style={styles.cardHeading}>
              <Text style={styles.cardTitle}>Diagnosis</Text>
              <Text style={styles.cardSubtitle}>{formatDate(record.date)}</Text>
            </View>
            <Text style={styles.diagnosisText}>{detail?.diagnosis ?? "No diagnosis recorded."}</Text>
          </View>
        </Reveal>

        <Reveal delay={200} distance={14}>
          <View style={styles.card}>
            <View style={styles.cardHeading}>
              <Text style={styles.cardTitle}>Clinical details</Text>
              <Text style={styles.cardSubtitle}>{record.title}</Text>
            </View>

            <View style={styles.specList}>
              <SpecRow label="Treatment" value={detail?.treatment ?? "—"} />
              <SpecRow label="Follow-up" value={detail?.followUp ?? "Not required"} />
              <SpecRow label="Status" value={status.label} last />
            </View>
          </View>
        </Reveal>

        <Reveal delay={280} distance={14}>
          <View style={styles.noteCard}>
            <Text style={styles.noteQuote}>“</Text>
            <Text style={styles.noteText}>{detail?.notes ?? "No notes."}</Text>

            <View style={styles.noteFooter}>
              <View style={styles.noteFooterBody}>
                <Text style={styles.noteAuthor}>{record.doctor}</Text>
                <Text style={styles.noteLabel}>Doctor&apos;s note · {formatDate(record.date)}</Text>
              </View>
            </View>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}