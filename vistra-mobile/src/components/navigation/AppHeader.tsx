import { brand } from "@/constants/theme";
import { navigationStyles as styles } from "@/styles/navigation.styles";
import { QrScanButton } from "@/components/scanner/QrScanButton";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VISTRA_LOGO = require("../../../assets/images/vistra-logo.png");

interface AppHeaderProps {
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onKioskScan?: (value: string) => void;
}

export function AppHeader({
  notificationCount = 0,
  onNotificationsPress,
  onKioskScan,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image
        source={VISTRA_LOGO}
        style={styles.headerLogo}
        resizeMode="contain"
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <QrScanButton onScanned={onKioskScan} />

        <Pressable
          onPress={onNotificationsPress}
          accessibilityLabel="Notifications"
          style={({ pressed }) => [styles.bellButton, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={20} color={brand.textPrimary} />
          {notificationCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}