import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { SecondaryButton } from "@/components/SecondaryButton";
import { messages } from "@/constants/messages";
import { colors, spacing } from "@/theme/theme";

const OUTER_RING_SIZE = 248;
const INNER_RING_SIZE = 180;
const CORE_SIZE = 112;
const CORE_ICON_SIZE = 56;

export default function CheckingScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={messages.checking.indicatorLabel}
          style={styles.outerRing}
        >
          <View style={styles.innerRing}>
            <View style={styles.core}>
              <Icon
                name="speaker"
                size={CORE_ICON_SIZE}
                color={colors.onAccent}
              />
            </View>
          </View>
        </View>

        <View accessible accessibilityLiveRegion="polite" style={styles.text}>
          <AppText variant="h1" bold style={styles.centered}>
            {messages.checking.title}
          </AppText>
          <AppText
            variant="body"
            color={colors.textMuted}
            style={styles.centered}
          >
            {messages.checking.body}
          </AppText>
        </View>
      </View>

      <SecondaryButton
        label={messages.checking.cancel}
        onPress={() => router.back()}
        accessibilityHint={messages.checking.cancelHint}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  outerRing: {
    width: OUTER_RING_SIZE,
    height: OUTER_RING_SIZE,
    borderRadius: OUTER_RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
  },
  innerRing: {
    width: INNER_RING_SIZE,
    height: INNER_RING_SIZE,
    borderRadius: INNER_RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.textMuted,
    opacity: 0.6,
  },
  core: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  text: {
    alignItems: "center",
    gap: spacing.sm,
  },
  centered: {
    textAlign: "center",
  },
});