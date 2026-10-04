import { AppText } from "@/components/AppText";
import { CornerButton } from "@/components/CornerButton";
import { GuidancePill } from "@/components/GuidancePill";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScanFrame } from "@/components/ScanFrame";
import { Screen } from "@/components/Screen";
import { messages } from "@/constants/messages";
import { colors, radii, spacing } from "@/theme/theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ScanScreen() {
  function handleScan() {
    // TODO: check connectivity, take the photo, then go to /checking
    console.log("Scan pressed");
  }

  return (
    <Screen>
      <View style={styles.topRow}>
        <CornerButton
          label={messages.scan.history}
          icon="history"
          onPress={() => router.push("/history")}
        />
        <CornerButton
          label={messages.scan.settings}
          icon="settings"
          onPress={() => router.push("/settings")}
        />
      </View>

      {/* TODO: replace this dark card with the live camera (expo-camera CameraView) */}
      <View style={styles.camera}>
        <AppText variant="body" bold style={styles.instruction}>
          {messages.scan.instruction}
        </AppText>
        <View style={styles.frameArea}>
          <ScanFrame />
        </View>
        <GuidancePill text={messages.scan.hint} />
      </View>

      <PrimaryButton
        label={messages.scan.scanButton}
        icon="camera"
        onPress={handleScan}
        accessibilityHint={messages.scan.scanButtonHint}
      />
    </Screen>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  camera: {
    flex: 1,
    marginVertical: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
  },
  instruction: {
    textAlign: "center",
  },
  frameArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
