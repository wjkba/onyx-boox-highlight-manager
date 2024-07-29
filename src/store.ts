import { create } from "zustand";

type HighlightCardOptions = {
  activeQuoteId: null | number;
  setActiveQuoteId: (id: number | null) => void;
};

export const useHighlightCardOptionsStore = create<HighlightCardOptions>(
  (set) => ({
    activeQuoteId: null,
    setActiveQuoteId: (id) => set({ activeQuoteId: id }),
  })
);

type HighlightCardEdit = {
  editingQuoteId: null | number;
  setEditingQutoeId: (id: number | null) => void;
};

export const useHighlightCardEditStore = create<HighlightCardEdit>((set) => ({
  editingQuoteId: null,
  setEditingQutoeId: (id) => set({ editingQuoteId: id }),
}));

type ZoomValue = {
  zoomValue: number;
  setZoomValue: (value: number) => void;
};

export const useZoomValueStore = create<ZoomValue>((set) => ({
  zoomValue: 1,
  setZoomValue: (value) => set({ zoomValue: value }),
}));
