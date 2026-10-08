// ────────────────────────────────────────────
// MOCK DATA: SAVED MEDICINES
// ────────────────────────────────────────────
// Temporary. Replaced by expo-sqlite data in milestone 7.
// Settings (count) and My medicines (list) both read from here.

export type SavedMedicine = {
  id: string;
  name: string;
};

export const MOCK_MEDICINES: SavedMedicine[] = [
  { id: "1", name: "Paracetamol 500 mg" },
  { id: "2", name: "Amlodipine 5 mg" },
  { id: "3", name: "Cetirizine 10 mg" },
];