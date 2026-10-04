import { colors, spacing } from "@/theme/theme";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── PROPS ───

type ScreenProps = {
  children: ReactNode;
};

// ─── COMPONENT ───

export function Screen({ children }: ScreenProps) {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}

// ─── STYLES ───

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
});
