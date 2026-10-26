import { brand } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            This section is under construction.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brand.background,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: brand.primaryDark,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: brand.textSecondary,
  },
});
