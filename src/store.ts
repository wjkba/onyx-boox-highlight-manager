import { create } from "zustand";
import { HighlightType } from "./utils/formatBoox";

// Highlights
type HighlightsStore = {
  highlights: HighlightType[] | [];
  setHighlights: (newHighlights: HighlightType[] | []) => void;
  addHighlights: (newHighlights: HighlightType) => void;
};

export const useHighlightsStore = create<HighlightsStore>((set) => ({
  highlights: [],
  setHighlights: (highlights) => set({ highlights }),
  addHighlights: (newHighlights) =>
    set((state) => ({ highlights: [...state.highlights, newHighlights] })),
}));

// Current
