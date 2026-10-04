import { colors, radii, sizes, spacing } from "@/theme/theme";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { IconName } from "./iconPaths";

// ─── PROPS ───

type PrimaryButtonProps = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  accessibilityHint?: string;
};

// ─── COMPONENT ───

export function PrimaryButton({
  label,
  icon,
  onPress,
  accessibilityHint,
}: PrimaryButtonProps) {
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
      {icon && <Icon name={icon} size={36} color={colors.onAccent} />}
      <AppText variant="title" bold color={colors.onAccent}>
        {label}
      </AppText>
    </Pressable>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.primaryButton,
    backgroundColor: colors.accent,
    borderRadius: radii.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.8,
  },
});
