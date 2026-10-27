import { Reveal } from "@/components/animation/Reveal";
import { brand } from "@/constants/theme";
import { STATUS_META } from "@/constants/status";
import {
  FILTERS,
  KIND_LABEL,
  MONTHS,
  SORT_LABEL,
  SORT_OPTIONS,
  parseDate,
  sortRecords,
  type Filter,
  type Sort,
} from "@/constants/recordsConfig";
import { PATIENT_RECORDS, type PatientRecord } from "@/mock/records";
import { recordsStyles as styles } from "@/styles/records.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

function RecordCard({ record }: { record: PatientRecord }) {
  const { day, month } = parseDate(record.date);
  const status = STATUS_META[record.status];
  const path =
    record.kind === "medical"
      ? `/record/${record.id}`
      : `/dental-record/${record.id}`;

  return (
    <Pressable
      onPress={() => router.push(path)}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <View style={styles.card}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{MONTHS[month]}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardType} numberOfLines={1}>
              {record.title}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: status.background }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {KIND_LABEL[record.kind]} · {record.doctor}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function RecordsScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  const counts = useMemo<Record<Filter, number>>(
    () => ({
      all: PATIENT_RECORDS.length,
      medical: PATIENT_RECORDS.filter((r) => r.kind === "medical").length,
      dental: PATIENT_RECORDS.filter((r) => r.kind === "dental").length,
    }),
    [],
  );

  const visible = useMemo(() => {
    const list =
      filter === "all"
        ? PATIENT_RECORDS
        : PATIENT_RECORDS.filter((r) => r.kind === filter);

    return sortRecords(list, sort);
  }, [filter, sort]);

  const chooseSort = (next: Sort) => {
    setSort(next);
    setSortOpen(false);
  };

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setSortOpen(false)}
      >
        <Reveal delay={0} distance={16}>
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Records</Text>
              <Text style={styles.subtitle}>
                Your medical and dental history in one place
              </Text>
            </View>
          </View>
        </Reveal>

        <Reveal delay={120} distance={16}>
          <View style={styles.segmented}>
            {FILTERS.map((item) => {
              const active = filter === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setFilter(item.key);
                    setSortOpen(false);
                  }}
                  style={[styles.segment, active && styles.segmentActive]}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {item.label}
                  </Text>
                  <Text style={styles.segmentCount}>{counts[item.key]}</Text>
                </Pressable>
              );
            })}
          </View>
        </Reveal>

        <Reveal delay={180} distance={16} style={{ zIndex: 10 }}>
          <View style={styles.toolbar}>
            <Text style={styles.count}>{visible.length} records</Text>

            <View style={styles.sortWrap}>
              <Pressable
                onPress={() => setSortOpen((open) => !open)}
                style={({ pressed }) => (pressed ? styles.pressed : undefined)}
              >
                <View style={styles.sortButton}>
                  <Text style={styles.sortText}>Sort: {SORT_LABEL[sort]}</Text>
                  <Ionicons
                    name={sortOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={brand.primaryDark}
                  />
                </View>
              </Pressable>

              {sortOpen && (
                <View style={styles.sortMenu}>
                  {SORT_OPTIONS.map((option) => {
                    const active = option.key === sort;

                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => chooseSort(option.key)}
                        style={({ pressed }) => [
                          styles.sortOption,
                          active && styles.sortOptionActive,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sortOptionText,
                            active && styles.sortOptionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </Reveal>

        <View style={styles.list}>
          {visible.length > 0 ? (
            visible.map((record, index) => (
              <Reveal key={record.id} delay={240 + index * 90} distance={18}>
                <RecordCard record={record} />
              </Reveal>
            ))
          ) : (
            <Reveal delay={240} distance={16}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No records here</Text>
                <Text style={styles.emptyText}>
                  Records from your visits will appear here.
                </Text>
              </View>
            </Reveal>
          )}
        </View>
      </ScrollView>
    </View>
  );
}