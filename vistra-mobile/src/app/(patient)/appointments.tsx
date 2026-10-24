import { Reveal } from "@/components/animation/Reveal";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { NewAppointmentModal } from "@/components/appointments/NewAppointmentModal";
import { brand } from "@/constants/theme";
import {
  FILTERS,
  SORT_LABEL,
  SORT_OPTIONS,
  sortAppointments,
  type AppointmentSort,
  type Filter,
} from "@/constants/appointmentsConfig";
import {
  PATIENT_APPOINTMENTS,
  type PatientAppointment,
} from "@/mock/appointments";
import { appointmentsStyles as styles } from "@/styles/appointments.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function AppointmentsScreen() {
  const [appointments, setAppointments] =
    useState<PatientAppointment[]>(PATIENT_APPOINTMENTS);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<AppointmentSort>("soonest");
  const [sortOpen, setSortOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const counts = useMemo<Record<Filter, number>>(
    () => ({
      all: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      upcoming: appointments.filter((a) => a.status === "upcoming").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    }),
    [appointments],
  );

  const visible = useMemo(() => {
    const list =
      filter === "all"
        ? appointments
        : appointments.filter((a) => a.status === filter);

    return sortAppointments(list, sort);
  }, [appointments, filter, sort]);

  const chooseSort = (next: AppointmentSort) => {
    setSort(next);
    setSortOpen(false);
  };

  const handleCreate = (appointment: PatientAppointment) => {
    setAppointments((prev) => [appointment, ...prev]);
    setFilter("pending");
    setModalOpen(false);
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
              <Text style={styles.title}>Appointments</Text>
              <Text style={styles.subtitle}>
                Track your pending, upcoming, and past visits
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setSortOpen(false);
                setModalOpen(true);
              }}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <View style={styles.newButton}>
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text style={styles.newButtonText}>New</Text>
              </View>
            </Pressable>
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
            <Text style={styles.count}>{visible.length} appointments</Text>

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
            visible.map((appointment, index) => (
              <Reveal key={appointment.id} delay={240 + index * 90} distance={18}>
                <AppointmentCard appointment={appointment} />
              </Reveal>
            ))
          ) : (
            <Reveal delay={240} distance={16}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No appointments here</Text>
                <Text style={styles.emptyText}>
                  Tap New to request your next visit.
                </Text>
              </View>
            </Reveal>
          )}
        </View>
      </ScrollView>

      <NewAppointmentModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </View>
  );
}