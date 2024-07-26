export type Quote = {
  id?: number;
  text: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};

export interface HighlightType {
  bookTitle: string;
  bookAuthor: string;
  quotes: Quote[];
}

export interface BookEntry extends HighlightType {
  id: number;
}

export type DailyReviewQuote = {
  bookAuthor: string;
  bookTitle: string;
  id: string;
  text: string;
  starred: boolean;
  date: string;
  lastReviewed: string | null;
};
