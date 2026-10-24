import { brand } from "@/constants/theme";
import type { ToothCondition, ToothRecord } from "@/mock/dentalChart";
import { toothChartStyles as styles } from "@/styles/toothChart.styles";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

type ToothType = "incisor" | "canine" | "premolar" | "molar";

export const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export const CONDITION_ORDER: ToothCondition[] = [
  "sound",
  "decayed",
  "filled",
  "missing",
  "extraction",
  "unerupted",
  "supernumerary",
];

export const CONDITION_STYLE: Record<
  ToothCondition,
  { label: string; fill: string; stroke: string; dashed?: boolean }
> = {
  sound: { label: "Sound (/)", fill: "#ffffff", stroke: "#94a3b8" },
  decayed: { label: "Decayed (D)", fill: "#fecaca", stroke: "#dc2626" },
  filled: { label: "Filled (F)", fill: "#bfdbfe", stroke: "#2563eb" },
  missing: { label: "Missing (M)", fill: "#f1f5f9", stroke: "#64748b", dashed: true },
  extraction: { label: "Indicated for extraction (X)", fill: "#fed7aa", stroke: "#ea580c" },
  unerupted: { label: "Unerupted (Un)", fill: "#f1f5f9", stroke: "#64748b", dashed: true },
  supernumerary: { label: "Supernumerary (Sn)", fill: "#e9d5ff", stroke: "#9333ea" },
};

const CROWN_PATH: Record<ToothType, string> = {
  incisor:
    "M16 4 C10.5 4 7 7 7 11.5 C7 15 8 17.5 9 20 C9.6 21.5 10.5 22.5 16 22.5 C21.5 22.5 22.4 21.5 23 20 C24 17.5 25 15 25 11.5 C25 7 21.5 4 16 4 Z",
  canine:
    "M16 3 C11 3 8 6.5 8 11 C8 14 9 16 10.5 18.5 C12.5 22 14.5 27 16 27 C17.5 27 19.5 22 21.5 18.5 C23 16 24 14 24 11 C24 6.5 21 3 16 3 Z",
  premolar:
    "M16 4 C10 4 6 7.5 6 12.5 C6 16 7.5 18.5 9 20.5 C10 21.8 12 22.5 16 22.5 C20 22.5 22 21.8 23 20.5 C24.5 18.5 26 16 26 12.5 C26 7.5 22 4 16 4 Z M11 11 L16 8 L21 11",
  molar:
    "M16 4 C9 4 4 7.5 4 13 C4 17 6 19.5 7.5 21.5 C9 23.3 12 24 16 24 C20 24 23 23.3 24.5 21.5 C26 19.5 28 17 28 13 C28 7.5 23 4 16 4 Z M8 12 L13 9 L16 12 L19 9 L24 12",
};

const ROOT_PATH: Record<ToothType, string> = {
  incisor: "M12 22.5 C12 30 13.5 36 16 38 C18.5 36 20 30 20 22.5",
  canine: "M13 24 C13 31 14 36 16 39 C18 36 19 31 19 24",
  premolar: "M11.5 20.5 C11 27 12.5 33 15 36 M20.5 20.5 C21 27 19.5 33 17 36",
  molar: "M9 21 C8.5 27 9.5 32 11.5 35 M16 22 C16 28 16 32 16 35 M23 21 C23.5 27 22.5 32 20.5 35",
};

export const getToothType = (number: number): ToothType => {
  const last = number % 10;

  if (last === 1 || last === 2) return "incisor";
  if (last === 3) return "canine";
  if (last === 4 || last === 5) return "premolar";

  return "molar";
};

const archOffset = (index: number, total: number, amplitude: number) => {
  const center = (total - 1) / 2;
  const t = Math.abs(index - center) / center;

  return Math.pow(t, 1.6) * amplitude;
};

function ToothShape({
  type,
  flip,
  fill,
  stroke,
  dashed,
}: {
  type: ToothType;
  flip: boolean;
  fill: string;
  stroke: string;
  dashed?: boolean;
}) {
  const dasharray = dashed ? "3 2.5" : undefined;

  return (
    <Svg width={26} height={34} viewBox="0 0 32 42">
      <G transform={flip ? "translate(0 42) scale(1 -1)" : undefined}>
        <Path
          d={ROOT_PATH[type]}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.6}
          strokeDasharray={dasharray}
        />
        <Path
          d={CROWN_PATH[type]}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.6}
          strokeDasharray={dasharray}
        />
      </G>
    </Svg>
  );
}

interface ToothBoxProps {
  number: number;
  flip: boolean;
  offset: number;
  record?: ToothRecord;
  selected: boolean;
  onPress: (number: number) => void;
}

function ToothBox({ number, flip, offset, record, selected, onPress }: ToothBoxProps) {
  const condition = record?.condition ?? "sound";
  const look = CONDITION_STYLE[condition];
  const numberColor = selected ? brand.primaryDark : record ? brand.primary : brand.textMuted;

  const numberLabel = <Text style={[styles.number, { color: numberColor }]}>{number}</Text>;

  return (
    <Pressable
      onPress={() => onPress(number)}
      style={[
        styles.tooth,
        selected && styles.toothSelected,
        { transform: [{ translateY: flip ? -offset : offset }] },
      ]}
    >
      {!flip && numberLabel}
      <ToothShape
        type={getToothType(number)}
        flip={flip}
        fill={look.fill}
        stroke={look.stroke}
        dashed={look.dashed}
      />
      {record && (
        <Text style={styles.tag}>{record.dentition === "temporary" ? "TEMP" : "PERM"}</Text>
      )}
      {flip && numberLabel}
    </Pressable>
  );
}

interface ArchRowProps {
  teeth: number[];
  flip: boolean;
  records: Partial<Record<number, ToothRecord>>;
  selected: number | null;
  onSelect: (number: number) => void;
}

function ArchRow({ teeth, flip, records, selected, onSelect }: ArchRowProps) {
  return (
    <View style={styles.archRow}>
      {teeth.map((number, index) => (
        <ToothBox
          key={number}
          number={number}
          flip={flip}
          offset={archOffset(index, teeth.length, 10)}
          record={records[number]}
          selected={selected === number}
          onPress={onSelect}
        />
      ))}
    </View>
  );
}

interface ToothChartProps {
  records: Partial<Record<number, ToothRecord>>;
  selected: number | null;
  onSelect: (number: number) => void;
}

export function ToothChart({ records, selected, onSelect }: ToothChartProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <View style={styles.chart}>
        <ArchRow
          teeth={UPPER_TEETH}
          flip={false}
          records={records}
          selected={selected}
          onSelect={onSelect}
        />
        <View style={styles.midline} />
        <ArchRow
          teeth={LOWER_TEETH}
          flip
          records={records}
          selected={selected}
          onSelect={onSelect}
        />
      </View>
    </ScrollView>
  );
}