import { colors, radii } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

// ─── COMPONENT ───

// Four accent corner brackets that show where to hold the medicine box.
// Decorative only, so it is hidden from screen readers.
export function ScanFrame() {
  return (
    <View
      style={styles.frame}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );
}

// ─── STYLES ───

const CORNER_SIZE = 52;
const CORNER_THICKNESS = 5;

const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: radii.sm,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: radii.sm,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: radii.sm,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: radii.sm,
  },
});
