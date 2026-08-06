import { create } from "zustand";

type HighlightCardOptions = {
  activeHighlightId: null | number;
  setActiveHighlightId: (id: number | null) => void;
};

export const useHighlightCardOptionsStore = create<HighlightCardOptions>(
  (set) => ({
    activeHighlightId: null,
    setActiveHighlightId: (id: number | null) => set({ activeHighlightId: id }),
  })
);

type HighlightCardEdit = {
  editingHighlightId: null | number;
  setEditingHighlightId: (id: number | null) => void;
};

export const useHighlightCardEditStore = create<HighlightCardEdit>((set) => ({
  editingHighlightId: null,
  setEditingHighlightId: (id: number | null) => set({ editingHighlightId: id }),
}));
