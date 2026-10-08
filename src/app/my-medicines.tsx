import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import { CornerButton } from "@/components/CornerButton";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { messages } from "@/constants/messages";
import { MOCK_MEDICINES } from "@/services/mockMedicines";
import { colors, spacing } from "@/theme/theme";

export default function MyMedicinesScreen() {
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
          {messages.myMedicines.title}
        </AppText>
      </View>

      <FlatList
        data={MOCK_MEDICINES}
        keyExtractor={(item) => item.id}
        accessibilityLabel={messages.myMedicines.listLabel}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        // No onPress: rows are display-only until removal is designed.
        renderItem={({ item }) => <ListRow label={item.name} />}
        ListEmptyComponent={
          <View accessible style={styles.empty}>
            <AppText variant="title" bold>
              {messages.myMedicines.empty}
            </AppText>
          </View>
        }
      />

      <View accessible style={styles.footer}>
        <AppText variant="bodySm" color={colors.textMuted}>
          {messages.settings.myMedicinesHelp}
        </AppText>
      </View>
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
  // "My medicines" at 40pt is wide next to the Back button, so it must be
  // allowed to wrap on narrow phones.
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
    paddingTop: spacing.lg,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});