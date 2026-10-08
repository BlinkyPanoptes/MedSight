# MedSight — Project Progress

Shared status of the app. Update this when you finish or start something, so everyone (and any AI assistant) knows what exists and what's next.

## What MedSight is
An assistive mobile app that helps visually impaired users identify medicines with the phone camera. The user points the camera at a medicine box, the photo goes to our backend, and the app **speaks the result** and **vibrates** a pattern for the status. The screen is for low-vision users and sighted helpers: black background, one yellow accent, very large text.

Design mockups: `Sample UI/MedSight Screens.pdf`.

## Current state
- Expo SDK 57 + React Native + TypeScript, expo-router (stack). Screens live in `src/app/`.
- Design tokens, font and all planned reusable components are done (see "Reusable building blocks").
- **All 8 screens are built** from the PDF: Scan, Checking, Result (verified / not verified), Offline, History, Settings, My medicines, plus a Voice picker (not in the PDF). They use mock data and are **not connected to each other by a real scan flow yet**.
- Scan screen: the camera area is still a dark placeholder card (no live camera) and the Scan button only logs.
- Result reads its data from route params (`status`, `name`, `strength`, `form`, `onList`, `doseNote`). Anything not clearly "verified" with complete details shows Not verified.
- Settings live in `SettingsContext` (**in memory only, reset on restart**). Speech speed and Voice are used by `useSpeech`. Vibration and High contrast are stored but nothing reads them yet.
- Mock data: History is hard-coded in `history.tsx`; saved medicines come from `src/services/mockMedicines.ts` (used by Settings and My medicines).
- `src/services/api.ts` and `src/types/` are still **empty**. Backend isn't connected. All network calls will go through `src/services/api.ts`.

## Reusable building blocks — use these, don't make new ones

| File | What it is | How to use it |
|---|---|---|
| `src/theme/theme.ts` | Design tokens: `colors`, `fonts`, `fontSizes`, `spacing`, `radii`, `sizes` | `import { colors, spacing } from "@/theme/theme"`. No hard-coded hex values or font sizes in components or screens. |
| `src/components/Screen.tsx` | Black, safe-area wrapper with 16px padding. Flex column that fills the screen | `<Screen>…</Screen>` as the outermost element of a screen |
| `src/components/AppText.tsx` | All text. Atkinson Hyperlegible font, white by default. Forwards extra `Text` props | `<AppText variant="h1" bold accessibilityRole="header">Title</AppText>` · `variant`: `display` 52, `h1` 40, `title` 30, `body` 24, `bodySm` 20, `caption` 18 · optional `bold`, `color`, `style` |
| `src/components/Icon.tsx` | Stroke icons, hidden from screen readers. Also re-exports the `IconName` type | `<Icon name="camera" size={32} color={colors.accent} />` · names: `camera`, `history`, `settings`, `speaker`, `check`, `warning`, `wifiOff`, `back`, `chevronRight`, `repeat` (add new ones in `iconPaths.ts`) |
| `src/components/PrimaryButton.tsx` | Main action: full-width yellow button, min height 96, light haptic. `icon` optional | `<PrimaryButton label="Scan" icon="camera" onPress={fn} accessibilityHint="…" />` |
| `src/components/SecondaryButton.tsx` | Outlined full-width button, min height 80, light haptic. `icon` optional | `<SecondaryButton label="Repeat" icon="repeat" onPress={fn} accessibilityHint="…" />` |
| `src/components/CornerButton.tsx` | Small raised button for the top corners (History, Settings, Back), min height 64, light haptic | `<CornerButton label="Back" icon="back" onPress={() => router.back()} accessibilityHint={messages.common.backHint} />` · always pass the hint |
| `src/components/ScanFrame.tsx` | Four yellow corner brackets over the camera. Fills its parent, no props | `<View style={{ flex: 1 }}><ScanFrame /></View>` |
| `src/components/GuidancePill.tsx` | Hint with speaker icon. `pill` (default): big black pill with yellow border, announces text changes. `caption`: small muted icon + text, hidden from screen readers | `<GuidancePill text="Move closer" />` · `<GuidancePill variant="caption" text="Tap anywhere to hear it again" />` |
| `src/components/StatusBanner.tsx` | Full-width colored banner with badge icon + word. Exports the `StatusTone` type (`"verified" \| "warning"`) | `<StatusBanner tone="verified" label="Verified" />`. Pass labels in normal case; the component uppercases them visually. Render it with `marginHorizontal: -spacing.md` inside `Screen` to run edge to edge. |
| `src/components/InfoCard.tsx` | Dark card with colored border, small colored label and body lines | `<InfoCard tone="warning" label="What to do" lines={["…", "…"]} />`. Lines are used as React keys, so keep them unique. |
| `src/components/ListRow.tsx` | Settings-style row: bold label, optional muted value. With `onPress`: button with right chevron. Without: display-only. Min height 64 | `<ListRow label="Voice" value="Phone default" onPress={fn} />` |
| `src/components/HistoryRow.tsx` | Display-only history row: status badge, title, "Status · time". Min height 100 | `<HistoryRow tone="verified" title="Paracetamol 500 mg" statusLabel="Verified" time="Today, 8:14 AM" />` |
| `src/components/ToggleRow.tsx` | Switch row (`switch` role): label, "On"/"Off" word, yellow toggle. Min height 80 | `<ToggleRow label="Vibration" value={on} onValueChange={setOn} stateLabel={on ? messages.settings.on : messages.settings.off} />` |
| `src/components/SegmentedControl.tsx` | Generic single-choice control (`radiogroup`), min height 64 per segment | `<SegmentedControl label="Speech speed" options={[{ label: "Slow", value: "slow" }, …]} value={speed} onChange={setSpeed} />` |
| `src/components/OptionRow.tsx` | Selectable list row (`radio` role): title, optional description, check icon + yellow border when selected. Min height 80 | `<OptionRow label="Samantha" description="English (US)" selected={on} onPress={fn} />` |
| `src/context/SettingsContext.tsx` | `SettingsProvider` (wraps the app in `_layout.tsx`) and `useSettings()`: `speechSpeed`, `vibration`, `highContrast`, `voice` and their setters. In memory only | `const { speechSpeed, voice } = useSettings()` |
| `src/hooks/useSpeech.ts` | Speaks text with the saved voice and speed. `speak` and `stop` are stable, safe in effect dependencies | `const { speak, stop } = useSpeech(); speak(text)` · never call `expo-speech` directly in screens |
| `src/services/mockMedicines.ts` | Temporary saved-medicines list shared by Settings and My medicines | `import { MOCK_MEDICINES } from "@/services/mockMedicines"` |
| `src/constants/messages.ts` | Every visible and spoken string | `import { messages } from "@/constants/messages"` then `messages.scan.instruction`. Add new strings here, not inside screens. |

## Conventions
- Styles go in a `StyleSheet.create()` at the bottom of each file, one property per line, using theme tokens.
- Never use the raw `<Text>`; use `AppText` (fonts don't inherit in React Native).
- Never show a status by color alone: icon + word + color.
- Text is never smaller than 18. Touch targets are at least 64 tall; main actions 80–96.
- Every touchable has `accessibilityRole` and `accessibilityLabel`. One documented exception: the "tap anywhere to repeat" wrapper on Result is hidden from screen readers, which use the Repeat button.
- Screen titles use `<AppText accessibilityRole="header" style={{ flexShrink: 1 }}>` so long titles wrap.
- Main action at the bottom, full width. Secondary actions in the top corners.
- Import with the `@/` alias (`@/` = `src/`).
- Install packages with `npx expo install <package>`, not `npm install`.
- Before committing, run `npx expo lint` and `npx tsc --noEmit`.

## Git workflow
- `main` is protected: nobody pushes to it directly. Changes reach `main` only through a pull request that @BlinkyPanoptes reviews and merges.
- `dev` is the shared working branch. Start your work from `dev`: `git switch dev`, `git pull`, then `git switch -c your-feature-name`.
- When your part works, push your branch and open a pull request **into `dev`**.
- `dev` is merged into `main` by pull request once it is checked and working.

## Milestones
| # | Milestone | Status |
|---|---|---|
| 1 | Foundation: clean project, `theme.ts`, `AppText`, `Screen`, `Icon`, buttons, empty screens | ✅ Done |
| 2 | More components: `InfoCard`, `StatusBanner`, `GuidancePill`, `ScanFrame`, `ListRow` (+ `HistoryRow`) | ✅ Done |
| 3 | Settings + feedback: `ToggleRow`, `SegmentedControl`, `SettingsContext`, speech | 🟡 In progress (components, context and `useSpeech` done; haptics via `feedback.ts` respecting Vibration, saving settings, and High contrast still to do) |
| 4 | Scan → Checking → Result (mock API) | 🟡 In progress (Checking and Result screens built; the flow and mock API are not connected) |
| 5 | Offline + errors | 🟡 In progress (Offline screen built, Try again checks NetInfo; the Scan screen doesn't route to it yet) |
| 6 | History | 🟡 In progress (screen built with mock data; no database yet) |
| 7 | My medicines (caregiver) | 🟡 In progress (screen built with mock data; no add or remove yet) |
| 8 | Polish | ⬜ Not started |
| 9 | Real API | ⬜ Not started |

This plan was made before the CSP221A project guide. It still needs to be checked against the guide (web deployment, CRUD through the backend API, CI/CD).

## Done
- Removed the Expo template examples; created empty files for the full folder structure
- `src/app/_layout.tsx`: root Stack, header hidden, loads the Atkinson Hyperlegible font, wraps the app in `SettingsProvider`
- `src/app/index.tsx`: Scan screen (History + Settings buttons, camera placeholder card, scan frame, guidance pill, Scan button)
- Screens: `checking.tsx`, `result.tsx` (verified / not verified, speaks the result, tap anywhere or Repeat to hear it again), `offline.tsx`, `history.tsx`, `settings.tsx`, `my-medicines.tsx`, `voice.tsx` (lists the voices installed on the phone, English only, plays a sample when one is picked)
- `src/theme/theme.ts`: design tokens
- Components: `AppText`, `Screen`, `Icon` + `iconPaths.ts`, `PrimaryButton`, `SecondaryButton`, `CornerButton`, `ScanFrame`, `GuidancePill`, `StatusBanner`, `InfoCard`, `ListRow`, `HistoryRow`, `ToggleRow`, `SegmentedControl`, `OptionRow`
- `src/context/SettingsContext.tsx`, `src/hooks/useSpeech.ts`, `src/services/mockMedicines.ts`
- `src/constants/messages.ts`: strings for all screens, including spoken text and accessibility hints
- Setup: `expo-camera`, `expo-speech`, `expo-haptics`, `expo-sqlite`, `expo-image-manipulator`, `@react-native-community/netinfo`, `react-native-svg`, the Atkinson font package, and ESLint (`eslint.config.js`). `npx expo lint`, `npx tsc --noEmit` and `npx expo-doctor` passed at setup; re-run them before the next commit.

## In progress
- (nothing)

## Up next
- Scan flow: live camera (`expo-camera` `CameraView`) in place of the dark card; Scan checks connectivity (→ `/offline`), takes the photo, goes to `/checking`, then `/result` with a mock API result
- Checking screen: speak `messages.checking.spoken` through `useSpeech`; Cancel should also abort the request
- `feedback.ts`: haptic patterns for verified / not verified, respecting the Vibration setting (the button haptics also ignore it today)
- Save settings so they survive an app restart (expo-sqlite is installed); apply High contrast
- Replace mock data with real storage: History and saved medicines in expo-sqlite
- Optional cleanup: add a `borderWidths` token (2, 3, 4 and 6 are hard-coded in components and screens) and move the repeated badge sizes (56 / 36) in `StatusBanner` and `HistoryRow` into `theme.ts`; add an `edges` option to `Screen` so the Result banner can fill the status bar area

## Open questions
- Where does the "Add to my medicines" button go? Settings and My medicines both tell the user to tap it, but no screen has it. Probably the Verified result. Strings are ready in `messages.myMedicines.add`.
- How does a caregiver remove a medicine? My medicines rows are display-only until this is designed.
- Does the speech engine read "mg" correctly on real devices? If it spells "m g", convert to "milligrams" in the spoken text only.
- Tune the speech rates in `useSpeech.ts` (slow 0.75, normal 1, fast 1.3) on real devices.