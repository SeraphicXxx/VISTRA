import type { Visit } from "@/mock/overview";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { formatDate } from "@/utils/dates";
import { Text, View } from "react-native";

interface RecentVisitsPanelProps {
  visits: Visit[];
}

function VisitRow({ visit, isLast }: { visit: Visit; isLast: boolean }) {
  return (
    <View style={[styles.timelineRow, !isLast && styles.timelineRowSpacing]}>
      {!isLast && <View style={styles.timelineLine} />}

      <View style={styles.timelineDotWrap}>
        <View style={styles.timelineDot} />
      </View>

      <View style={styles.timelineBody}>
        <View style={styles.timelineTitleRow}>
          <Text style={styles.timelineComplaint}>{visit.complaint}</Text>
          <Text style={styles.timelineDate}>{formatDate(visit.date)}</Text>
        </View>
        <Text style={styles.timelineMeta}>
          {visit.doctor} · {visit.treatmentType}
        </Text>
      </View>
    </View>
  );
}

export function RecentVisitsPanel({ visits }: RecentVisitsPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.panelTitle}>Recent Visits</Text>
          <Text style={styles.panelSubtitle}>Your last clinic check-ins</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{visits.length} recent</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {visits.length > 0 ? (
          visits.map((visit, i) => (
            <VisitRow key={visit.id} visit={visit} isLast={i === visits.length - 1} />
          ))
        ) : (
          <View style={styles.emptyVisits}>
            <Text style={styles.emptyVisitsText}>
              No visits yet — your check-ins will appear here.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}