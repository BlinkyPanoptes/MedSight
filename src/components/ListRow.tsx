import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import { Icon } from "@/components/Icon";
import { colors, radii, sizes, spacing } from "@/theme/theme";

type ListRowProps = {
  label: string;
  value?: string;
  onPress: () => void;
  accessibilityHint?: string;
};

export function ListRow({
  label,
  value,
  onPress,
  accessibilityHint,
}: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppText variant="title" bold style={styles.label}>
        {label}
      </AppText>
      <View style={styles.trailing}>
        {value ? (
          <AppText variant="body" bold color={colors.textMuted}>
            {value}
          </AppText>
        ) : null}
        <Icon name="chevronRight" size={32} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    minHeight: sizes.cornerButton,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
  label: {
    flexShrink: 1,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});