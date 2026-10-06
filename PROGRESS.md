# MedSight — Project Progress

Shared status of the app. Update this when you finish or start something, so everyone (and any AI assistant) knows what exists and what's next.

## What MedSight is
An assistive mobile app that helps visually impaired users identify medicines with the phone camera. The user points the camera at a medicine box, the photo goes to our backend, and the app **speaks the result** and **vibrates** a pattern for the status. The screen is for low-vision users and sighted helpers: black background, one yellow accent, very large text.

Design mockups: `Sample UI/MedSight Screens.pdf`.

## Current state
- Expo SDK 57 + React Native + TypeScript, expo-router (stack). Screens live in `src/app/`.
- Design tokens, font, and the first reusable components are done (see "Reusable building blocks").
- **Scan screen (`src/app/index.tsx`) matches design 1 in the PDF**, but the camera area is a dark placeholder card (no live camera yet) and the Scan button only logs.
- The other 6 screens (`checking`, `result`, `offline`, `history`, `settings`, `my-medicines`) are **placeholders**: a Back button, a title, and "This screen is not built yet." History and Settings open from the Scan screen.
- Files in `src/services/`, `src/context/`, `src/hooks/` and `src/types/` are still **empty**.
- Backend isn't connected. All network calls will go through `src/services/api.ts`.

## Reusable building blocks — use these, don't make new ones

| File | What it is | How to use it |
|---|---|---|
| `src/theme/theme.ts` | Design tokens: `colors`, `fonts`, `fontSizes`, `spacing`, `radii`, `sizes` | `import { colors, spacing } from "@/theme/theme"`. No hard-coded hex values or font sizes in components or screens. |
| `src/components/Screen.tsx` | Black, padded, safe-area wrapper for every screen | `<Screen>…</Screen>` as the outermost element of a screen |
| `src/components/AppText.tsx` | All text. Atkinson Hyperlegible font, white by default | `<AppText variant="h1" bold>Title</AppText>` · `variant`: `display` 52, `h1` 40, `title` 30, `body` 24, `bodySm` 20, `caption` 18 · optional `bold`, `color`, `style` |
| `src/components/Icon.tsx` | Stroke icons, hidden from screen readers | `<Icon name="camera" size={32} color={colors.accent} />` · names: `camera`, `history`, `settings`, `speaker`, `check`, `warning`, `wifiOff`, `back`, `chevronRight`, `repeat` (add new ones in `iconPaths.ts`) |
| `src/components/PrimaryButton.tsx` | Main action: full-width yellow button, min height 96, light haptic on press | `<PrimaryButton label="Scan" icon="camera" onPress={fn} accessibilityHint="…" />` |
| `src/components/CornerButton.tsx` | Small raised button for the top corners (History, Settings, Back), min height 64 | `<CornerButton label="Back" icon="back" onPress={() => router.back()} />` |
| `src/components/ScanFrame.tsx` | Four yellow corner brackets over the camera. Fills its parent, no props | `<View style={{ flex: 1 }}><ScanFrame /></View>` |
| `src/components/GuidancePill.tsx` | Black pill with yellow border and speaker icon, for the big camera hint. Announces text changes to screen readers | `<GuidancePill text="Move closer" />` |
| `src/constants/messages.ts` | Every visible and spoken string | `import { messages } from "@/constants/messages"` then `messages.scan.instruction`. Add new strings here, not inside screens. |

## Conventions
- Styles go in a `StyleSheet.create()` at the bottom of each file, one property per line, using theme tokens.
- Never use the raw `<Text>`; use `AppText` (fonts don't inherit in React Native).
- Never show a status by color alone: icon + word + color.
- Text is never smaller than 18. Touch targets are at least 64 tall; main actions 80–96.
- Every touchable has `accessibilityRole` and `accessibilityLabel`.
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
| 1 | Foundation: clean project, `theme.ts`, `AppText`, `Screen`, `Icon`, buttons (`PrimaryButton`, `SecondaryButton`, `CornerButton`), empty screens | ✅ Done |
| 2 | More components: `InfoCard`, `StatusBanner`, `GuidancePill`, `ScanFrame`, `ListRow` (+ `HistoryRow`) | ✅ Done |
| 3 | Settings + feedback: `ToggleRow`, `SegmentedControl`, `feedback.ts`, `SettingsContext` | 🟡 In progress (components done; `feedback.ts` and `SettingsContext` still to build) |
| 4 | Scan → Checking → Result (mock API) | ⬜ Not started |
| 5 | Offline + errors | ⬜ Not started |
| 6 | History | ⬜ Not started |
| 7 | My medicines (caregiver) | ⬜ Not started |
| 8 | Polish | ⬜ Not started |
| 9 | Real API | ⬜ Not started |

This plan was made before the CSP221A project guide. It still needs to be checked against the guide (web deployment, CRUD through the backend API, CI/CD).

## Done
- Removed the Expo template examples; created empty files for the full folder structure
- `src/app/_layout.tsx`: root Stack, header hidden, loads the Atkinson Hyperlegible font (`useFonts` + splash screen)
- `src/app/index.tsx`: Scan screen layout from design 1 (History + Settings buttons, camera card with instruction, scan frame, guidance pill, Scan button)
- Placeholder screens with a working Back button: `checking`, `result`, `offline`, `history`, `settings`, `my-medicines`
- `src/theme/theme.ts`: design tokens
- `src/components/AppText.tsx`, `Screen.tsx`, `Icon.tsx` + `iconPaths.ts`, `PrimaryButton.tsx`, `CornerButton.tsx`, `ScanFrame.tsx`, `GuidancePill.tsx`
- [ADDED OCT 7] `src/components/SecondaryButton.tsx`, `InfoCard.tsx`, `StatusBanner.tsx`, `ListRow.tsx`, `HistoryRow.tsx`, `ToggleRow.tsx`, `SegmentedControl.tsx`
- `src/constants/messages.ts`: strings for the Scan screen
- Setup: `expo-camera`, `expo-speech`, `expo-haptics`, `expo-sqlite`, `expo-image-manipulator`, `@react-native-community/netinfo`, `react-native-svg`, the Atkinson font package, and ESLint (`eslint.config.js`). `npx expo lint`, `npx tsc --noEmit` and `npx expo-doctor` all pass.

## In progress
- (nothing)

## Up next (ORIGINAL)
- Components still to build: `SecondaryButton` (outlined, min height 80), `InfoCard`, `StatusBanner`, `ListRow`, `HistoryRow`, `ToggleRow`, `SegmentedControl`
- Screens 2–7 from the PDF: Checking, Result (verified / not verified), No internet, History, Settings
- Scan screen: live camera in place of the dark card, and the real Scan action

## Up next (OCT 7)
- Screens 2–7 from the PDF, using the finished components: Checking, Result (verified / not verified), No internet, History, Settings
- Add the strings for those screens to `messages.ts` (Result, Offline, History, Settings, including the "On"/"Off" labels)
- `feedback.ts` (speech + haptics, respecting the Vibration setting) and `SettingsContext`
- Scan screen: live camera in place of the dark card, and the real Scan action
- Optional cleanup: add a `borderWidths` token (2 and 3 are currently hard-coded in the components) and move the repeated badge sizes (56 / 36) in `StatusBanner` and `HistoryRow` into `theme.ts`
