export type List = {
  id: number;
  name: string;
  quotes: Highlight[];
};

export type NewHighlight = {
  text: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};

export type Highlight = {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  text: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};
