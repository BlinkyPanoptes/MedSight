// ────────────────────────────────────────────
// ICON PATHS
// ────────────────────────────────────────────
// Stroke icons drawn on a 24 × 24 grid. Each icon is a list of SVG path
// strings; <Icon> draws every path with the same stroke color and width.
// history, wifiOff and repeat are adapted from Lucide (ISC license).

export const iconPaths = {
  camera: [
    "M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M12 10a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z",
  ],
  history: [
    "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
    "M3 3v5h5",
    "M12 7v5l4 2",
  ],
  settings: [
    "M4 8h3",
    "M13 8h7",
    "M10 5a3 3 0 1 0 0 6a3 3 0 1 0 0-6z",
    "M4 16h9",
    "M19 16h1",
    "M16 13a3 3 0 1 0 0 6a3 3 0 1 0 0-6z",
  ],
  speaker: [
    "M4 9v6h4l5 4V5L8 9z",
    "M16.5 9a4 4 0 0 1 0 6",
    "M19 6.5a7.5 7.5 0 0 1 0 11",
  ],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  warning: ["M12 3.5L2.5 20h19z", "M12 10v4.5", "M12 17.5h.01"],
  wifiOff: [
    "M12 20h.01",
    "M8.5 16.429a5 5 0 0 1 7 0",
    "M5 12.859a10 10 0 0 1 5.17-2.69",
    "M19 12.859a10 10 0 0 0-2.007-1.523",
    "M2 8.82a15 15 0 0 1 4.177-2.643",
    "M22 8.82a15 15 0 0 0-11.288-3.764",
    "M2 2l20 20",
  ],
  back: ["M15 5l-7 7 7 7"],
  chevronRight: ["M9 5l7 7-7 7"],
  repeat: [
    "M17 2l4 4-4 4",
    "M3 11v-1a4 4 0 0 1 4-4h14",
    "M7 22l-4-4 4-4",
    "M21 13v1a4 4 0 0 1-4 4H3",
  ],
};

// The allowed icon names, taken from the keys above:
// "camera" | "history" | "settings" | ... | "repeat"
export type IconName = keyof typeof iconPaths;
