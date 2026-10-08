import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import { CornerButton } from "@/components/CornerButton";
import { HistoryRow } from "@/components/HistoryRow";
import { Screen } from "@/components/Screen";
import { StatusTone } from "@/components/StatusBanner";
import { messages } from "@/constants/messages";
import { colors, spacing } from "@/theme/theme";

type HistoryEntry = {
  id: string;
  tone: StatusTone;
  title: string;
  statusLabel: string;
  day: string;
  time: string;
};

// Mock data matching the mockup. Replace with expo-sqlite data later.
const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "1",
    tone: "verified",
    title: "Paracetamol 500 mg",
    statusLabel: messages.history.status.verified,
    day: messages.history.today,
    time: "8:14 AM",
  },
  {
    id: "2",
    tone: "verified",
    title: "Amlodipine 5 mg",
    statusLabel: messages.history.status.verified,
    day: messages.history.today,
    time: "7:02 AM",
  },
  {
    id: "3",
    tone: "warning",
    title: messages.history.unknownMedicine,
    statusLabel: messages.history.status.notVerified,
    day: messages.history.yesterday,
    time: "9:40 PM",
  },
  {
    id: "4",
    tone: "verified",
    title: "Cetirizine 10 mg",
    statusLabel: messages.history.status.verified,
    day: messages.history.yesterday,
    time: "8:15 PM",
  },
  {
    id: "5",
    tone: "warning",
    title: messages.history.couldNotRead,
    statusLabel: messages.history.status.tryAgain,
    day: "Mon",
    time: "6:30 PM",
  },
];

export default function HistoryScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <CornerButton
          label={messages.common.back}
          icon="back"
          onPress={() => router.back()}
          accessibilityHint={messages.common.backHint}
        />
        <AppText
          variant="h1"
          bold
          accessibilityRole="header"
          style={styles.title}
        >
          {messages.history.title}
        </AppText>
      </View>

      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        accessibilityLabel={messages.history.listLabel}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HistoryRow
            tone={item.tone}
            title={item.title}
            statusLabel={item.statusLabel}
            time={messages.history.dateTime(item.day, item.time)}
          />
        )}
        ListEmptyComponent={
          <View accessible style={styles.empty}>
            <AppText variant="title" bold>
              {messages.history.empty}
            </AppText>
            <AppText variant="body" color={colors.textMuted}>
              {messages.history.emptyHint}
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  // Lets a long title wrap instead of running off the screen.
  title: {
    flexShrink: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  empty: {
    gap: spacing.xs,
    paddingTop: spacing.lg,
  },
});