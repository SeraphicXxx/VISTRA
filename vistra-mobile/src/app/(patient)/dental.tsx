import { Reveal } from "@/components/animation/Reveal";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { ScrollView, Text, View } from "react-native";

export default function DentalScreen() {
  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Reveal delay={0} distance={16}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Dental Records</Text>
            <Text style={styles.panelSubtitle}>
              Your dental treatments and check-ups
            </Text>
          </View>
        </Reveal>

        <Reveal delay={120} distance={20}>
          <View style={styles.emptyVisits}>
            <Text style={styles.emptyVisitsText}>
              Your dental records will appear here.
            </Text>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}