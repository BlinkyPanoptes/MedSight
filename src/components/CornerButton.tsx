import { colors, radii, sizes, spacing } from "@/theme/theme";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { IconName } from "./iconPaths";

// ─── PROPS ───

type CornerButtonProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
  accessibilityHint?: string;
};

// ─── COMPONENT ───

export function CornerButton({
  label,
  icon,
  onPress,
  accessibilityHint,
}: CornerButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={28} />
      <AppText variant="bodySm" bold>
        {label}
      </AppText>
    </Pressable>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.cornerButton,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radii.sm,
  },
  pressed: {
    opacity: 0.8,
  },
});
