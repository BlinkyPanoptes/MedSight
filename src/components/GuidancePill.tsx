import { colors, radii, sizes, spacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

// ─── PROPS ───

type GuidancePillProps = {
  text: string;
};

// ─── COMPONENT ───

// Big hint shown over the camera. When the text changes, screen readers
// announce the new hint (accessibilityLiveRegion).
export function GuidancePill({ text }: GuidancePillProps) {
  return (
    <View
      style={styles.pill}
      accessible
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
    >
      <Icon name="speaker" size={36} color={colors.accent} />
      <AppText variant="title" bold style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  pill: {
    minHeight: sizes.cornerButton,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: radii.md,
  },
  text: {
    flexShrink: 1,
  },
});
