import { NewAppointmentForm } from "@/components/appointments/NewAppointmentForm";
import { brand } from "@/constants/theme";
import type { PatientAppointment } from "@/mock/appointments";
import { appointmentsStyles as styles } from "@/styles/appointments.styles";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, View } from "react-native";

interface NewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (appointment: PatientAppointment) => void;
}

export function NewAppointmentModal({ visible, onClose, onSubmit }: NewAppointmentModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHandle} />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={16} color={brand.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <NewAppointmentForm onSubmit={onSubmit} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}