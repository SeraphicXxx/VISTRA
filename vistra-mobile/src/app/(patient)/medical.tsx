import { Reveal } from "@/components/animation/Reveal";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { ScrollView, Text, View } from "react-native";

export default function MedicalScreen() {
  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Reveal delay={0} distance={16}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Medical Records</Text>
            <Text style={styles.panelSubtitle}>
              Your clinic records and visit history
            </Text>
          </View>
        </Reveal>

        <Reveal delay={120} distance={20}>
          <View style={styles.emptyVisits}>
            <Text style={styles.emptyVisitsText}>
              Your medical records will appear here.
            </Text>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}