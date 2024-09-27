export type List = {
  id: number;
  name: string;
  highlightIds: number[];
};

export type NewHighlight = {
  quote: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};

export type Highlight = {
  id: number;
  bookId: number;
  quote: string;
  starred: boolean;
  date: string;
  dateAdded: string;
  lastReviewed: string | null;
};

export type Book = {
  id: number;
  bookTitle: string;
  bookAuthor: string;
};
