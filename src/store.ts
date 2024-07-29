import { create } from "zustand";

type highlightIds = {
  bookId: number;
  quoteId: number;
};

type HighlightCardOptions = {
  activeQuoteIds: null | highlightIds;
  setActiveQuoteIds: (ids: highlightIds | null) => void;
};

export const useHighlightCardOptionsStore = create<HighlightCardOptions>(
  (set) => ({
    activeQuoteIds: null,
    setActiveQuoteIds: (ids: highlightIds | null) =>
      set({ activeQuoteIds: ids }),
  })
);

type HighlightCardEdit = {
  editingQuoteIds: null | highlightIds;
  setEditingQutoeIds: (ids: highlightIds | null) => void;
};

export const useHighlightCardEditStore = create<HighlightCardEdit>((set) => ({
  editingQuoteIds: null,
  setEditingQutoeIds: (ids: highlightIds | null) =>
    set({ editingQuoteIds: ids }),
}));
