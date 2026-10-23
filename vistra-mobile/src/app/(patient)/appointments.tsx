import { Reveal } from "@/components/animation/Reveal";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { ScrollView, Text, View } from "react-native";

export default function AppointmentsScreen() {
  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Reveal delay={0} distance={16}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Appointments</Text>
            <Text style={styles.panelSubtitle}>
              Your upcoming and past clinic visits
            </Text>
          </View>
        </Reveal>

        <Reveal delay={120} distance={20}>
          <View style={styles.emptyVisits}>
            <Text style={styles.emptyVisitsText}>
              Your appointments will appear here.
            </Text>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}