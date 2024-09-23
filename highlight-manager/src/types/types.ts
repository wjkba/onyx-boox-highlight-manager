export type List = {
  id: number;
  name: string;
  quotes: Highlight[];
};

export type NewHighlight = {
  quote: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};

export type Highlight = {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  quote: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};
