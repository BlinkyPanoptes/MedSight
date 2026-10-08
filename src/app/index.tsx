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
// import { Pressable, StyleSheet, Text, View } from "react-native"; //for testing only (REPLACEMENT FOR ABOVE ROW); delete/comment out before commit

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
          accessibilityHint={messages.scan.historyHint}
        />
        <CornerButton
          label={messages.scan.settings}
          icon="settings"
          onPress={() => router.push("/settings")}
          accessibilityHint={messages.scan.settingsHint}
        />
      </View>
      
      {/* {__DEV__ ? ( // FOR TESTING ONLY. NO IMPACT BUT DELETE BEFORE FINAL BUILD. shows "checking", "verified", "not verified", "offline" screens.
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Checking", go: () => router.push("/checking") },
            {
              label: "Verified",
              go: () =>
                router.push({
                  pathname: "/result",
                  params: {
                    status: "verified",
                    name: "Paracetamol",
                    strength: "500 mg",
                    form: "Tablet",
                    onList: "true",
                    doseNote: "Take one tablet after breakfast.",
                  },
                }),
            },
            {
              label: "Not verified",
              go: () =>
                router.push({ pathname: "/result", params: { status: "notVerified" } }),
            },
            { label: "Offline", go: () => router.push("/offline") },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={item.go}
              style={{ padding: 8, backgroundColor: "#333", borderRadius: 8 }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null} */}

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