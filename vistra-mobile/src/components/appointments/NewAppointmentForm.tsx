import { brand } from "@/constants/theme";
import {
  APPOINTMENT_TYPES,
  BOOKING_DAYS,
  TIME_SLOTS,
  type PatientAppointment,
} from "@/mock/appointments";
import { appointmentsStyles as styles } from "@/styles/appointments.styles";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface NewAppointmentFormProps {
  onSubmit: (appointment: PatientAppointment) => void;
}

export function NewAppointmentForm({ onSubmit }: NewAppointmentFormProps) {
  const [type, setType] = useState<string | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const canSubmit = Boolean(type && time);

  const handleSubmit = () => {
    if (!type || !time) return;

    onSubmit({
      id: `apt-${Date.now()}`,
      type,
      doctor: "Next available doctor",
      date: BOOKING_DAYS[dayIndex],
      time,
      status: "pending",
      reason: reason.trim() || undefined,
    });

    setType(null);
    setTime(null);
    setReason("");
    setDayIndex(0);
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>New appointment</Text>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Type</Text>
        <View style={styles.chipRow}>
          {APPOINTMENT_TYPES.map((item) => {
            const active = type === item;
            return (
              <Pressable
                key={item}
                onPress={() => setType(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {BOOKING_DAYS.map((iso, index) => {
            const d = new Date(iso);
            const active = dayIndex === index;
            return (
              <Pressable
                key={iso}
                onPress={() => setDayIndex(index)}
                style={[styles.dayChip, active && styles.dayChipActive]}
              >
                <Text style={[styles.dayChipDow, active && styles.dayChipTextActive]}>
                  {DAY_NAMES[d.getDay()]}
                </Text>
                <Text style={[styles.dayChipDate, active && styles.dayChipTextActive]}>
                  {d.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Time</Text>
        <View style={styles.chipRow}>
          {TIME_SLOTS.map((slot) => {
            const active = time === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => setTime(slot)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Reason (optional)</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Tell us what's bothering you"
          placeholderTextColor={brand.textMuted}
          multiline
          style={styles.reasonInput}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>Request appointment</Text>
      </Pressable>
    </View>
  );
}