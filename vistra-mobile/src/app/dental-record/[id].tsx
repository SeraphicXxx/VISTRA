import { Reveal } from "@/components/animation/Reveal";
import {
  CONDITION_ORDER,
  CONDITION_STYLE,
  ToothChart,
  UPPER_TEETH,
} from "@/components/dental/ToothChart";
import { SubHeader } from "@/components/navigation/SubHeader";
import { brand } from "@/constants/theme";
import { DENTAL_CHART, type ToothCondition } from "@/mock/dentalChart";
import { DENTAL_EXAMINATION } from "@/mock/dentalExamination";
import { PATIENT_RECORDS, type RecordStatus } from "@/mock/records";
import { dentalRecordStyles as styles } from "@/styles/dentalRecord.styles";
import { formatDate } from "@/utils/dates";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const STATUS_META: Record<RecordStatus, { label: string; color: string; background: string }> = {
  "in-progress": { label: "In progress", color: "#d97706", background: "#fef3c7" },
  "follow-up": { label: "Follow-up", color: brand.textSecondary, background: brand.border },
  completed: { label: "Completed", color: brand.primaryDark, background: "rgba(20,184,166,0.12)" },
};

const SHORT_LABEL: Record<ToothCondition, string> = {
  sound: "Sound",
  decayed: "Decayed",
  filled: "Filled",
  missing: "Missing",
  extraction: "Extraction",
  unerupted: "Unerupted",
  supernumerary: "Supernumerary",
};

const QUADRANTS = ["Upper right", "Upper left", "Lower left", "Lower right"];
const POSITIONS = [
  "central incisor",
  "lateral incisor",
  "canine",
  "first premolar",
  "second premolar",
  "first molar",
  "second molar",
  "third molar",
];

const getToothName = (number: number) => {
  const quadrant = QUADRANTS[Math.floor(number / 10) - 1];
  const position = POSITIONS[(number % 10) - 1];

  return position ? `${quadrant} ${position}` : quadrant;
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

export default function DentalRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const record = PATIENT_RECORDS.find((r) => r.id === id && r.kind === "dental");
  const visit = DENTAL_CHART.visits.find((v) => v.id === id);

  if (!record) {
    return (
      <View style={styles.safe}>
        <SubHeader title="Dental Record" backTo="/(patient)/records" />
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No record found</Text>
          <Text style={styles.emptyText}>This record may have been removed.</Text>
        </View>
      </View>
    );
  }

  const chart = DENTAL_CHART;
  const status = STATUS_META[record.status];

  const countOf = (condition: ToothCondition) =>
    Object.values(chart.teeth).filter((tooth) => tooth?.condition === condition).length;

  const examFields = [
    { label: "Flosses regularly", value: DENTAL_EXAMINATION.flossesRegularly },
    { label: "Brushing frequency", value: DENTAL_EXAMINATION.brushingFrequency },
    { label: "Calculus", value: DENTAL_EXAMINATION.calculus },
    { label: "Medication", value: DENTAL_EXAMINATION.medication },
  ];

  const toothRecord = selectedTooth ? chart.teeth[selectedTooth] : undefined;
  const toothLook = CONDITION_STYLE[toothRecord?.condition ?? "sound"];
  const isUpper = selectedTooth ? UPPER_TEETH.includes(selectedTooth) : false;
  const dentitionLabel = !toothRecord
    ? "Not recorded"
    : toothRecord.dentition === "temporary"
      ? "Temporary"
      : "Permanent";
  const toothNotes =
    toothRecord?.notes ??
    (toothRecord ? "No notes." : "No findings recorded. This tooth is healthy.");

  return (
    <View style={styles.safe}>
      <SubHeader title="Dental Record" backTo="/(patient)/records" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal delay={0} distance={14}>
          <View style={styles.header}>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}>DENTAL RECORD</Text>
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

        <Reveal delay={120} distance={14}>
          <View style={styles.examCard}>
            <View style={styles.examHeader}>
              <View style={styles.examIcon}>
                <Ionicons name="clipboard-outline" size={18} color={brand.primaryDark} />
              </View>
              <View style={styles.examHeading}>
                <Text style={styles.examTitle}>{visit?.treatment ?? "Treatment"}</Text>
                <Text style={styles.examSubtitle}>Last visit: {formatDate(record.date)}</Text>
              </View>
              <View style={styles.examEdit}>
                <Ionicons name="create-outline" size={16} color={brand.textSecondary} />
              </View>
            </View>

            <View style={styles.examDivider} />

            <View style={styles.examGrid}>
              {examFields.map((field) => (
                <View key={field.label} style={styles.examCell}>
                  <Text style={styles.examLabel}>{field.label}</Text>
                  <Text style={styles.examValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </Reveal>

        <Reveal delay={240} distance={16}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dental chart</Text>
              <Text style={styles.sectionCaption}>Patient&apos;s right on the left</Text>
            </View>

            <View style={styles.chartCard}>
              <ToothChart
                records={chart.teeth}
                selected={selectedTooth}
                onSelect={(number) => setSelectedTooth(number === selectedTooth ? null : number)}
              />
            </View>

            <View style={styles.legendGrid}>
              {CONDITION_ORDER.map((condition, index) => {
                const look = CONDITION_STYLE[condition];
                const count = countOf(condition);
                const isLastSingle = index === CONDITION_ORDER.length - 1;

                return (
                  <View
                    key={condition}
                    style={[styles.legendTile, isLastSingle && styles.legendTileWide]}
                  >
                    <View
                      style={[
                        styles.legendSwatch,
                        {
                          backgroundColor: look.fill,
                          borderColor: look.stroke,
                          borderStyle: look.dashed ? "dashed" : "solid",
                        },
                      ]}
                    />
                    <Text style={styles.legendText}>{SHORT_LABEL[condition]}</Text>
                    <Text
                      style={[
                        styles.legendCount,
                        count > 0 && { color: look.stroke },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Reveal>

        <Reveal delay={320} distance={16}>
          {selectedTooth ? (
            <View style={styles.detailCard}>
              <View style={styles.detailHead}>
                <View style={styles.detailNumberBox}>
                  <Text style={styles.detailNumber}>{selectedTooth}</Text>
                </View>
                <View style={styles.detailHeadBody}>
                  <Text style={styles.detailEyebrow}>SELECTED TOOTH</Text>
                  <Text style={styles.detailName}>{getToothName(selectedTooth)}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.conditionBanner,
                  { backgroundColor: toothLook.fill, borderColor: toothLook.stroke },
                ]}
              >
                <View style={[styles.conditionDot, { backgroundColor: toothLook.stroke }]} />
                <Text style={[styles.conditionBannerText, { color: toothLook.stroke }]}>
                  {toothLook.label}
                </Text>
              </View>

              <View style={styles.specList}>
                <SpecRow label="Arch" value={isUpper ? "Upper" : "Lower"} />
                <SpecRow label="Dentition" value={dentitionLabel} />
                <SpecRow label="Record on file" value={toothRecord ? "Yes" : "No"} last />
              </View>

              <View style={styles.noteBlock}>
                <Text style={styles.noteLabel}>Clinical notes</Text>
                <Text style={styles.noteText}>{toothNotes}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyDetail}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="tooth-outline" size={22} color={brand.primaryDark} />
              </View>
              <Text style={styles.emptyDetailTitle}>Select a tooth</Text>
              <Text style={styles.hint}>
                Tap any tooth in the chart to view its condition and notes.
              </Text>
            </View>
          )}
        </Reveal>
      </ScrollView>
    </View>
  );
}