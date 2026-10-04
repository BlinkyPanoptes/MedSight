import { AppText } from "@/components/AppText";
import { CornerButton } from "@/components/CornerButton";
import { Screen } from "@/components/Screen";
import { messages } from "@/constants/messages";
import { colors, spacing } from "@/theme/theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

// PLACEHOLDER: this screen is not built yet. Replace the body with the real
// design (see "Sample UI/MedSight Screens.pdf"), reusing src/components.
export default function ResultScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <CornerButton
          label={messages.common.back}
          icon="back"
          onPress={() => router.back()}
        />
        <AppText variant="h1" bold style={styles.title}>
          Result
        </AppText>
      </View>
      <AppText variant="body" color={colors.textMuted}>
        {messages.common.notBuiltYet}
      </AppText>
    </Screen>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    flexShrink: 1,
  },
});
