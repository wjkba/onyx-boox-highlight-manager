export type Quote = {
  id?: number;
  text: string;
  starred: boolean;
  date: string;
};

export interface HighlightType {
  bookTitle: string;
  bookAuthor: string;
  quotes: Quote[];
}

export interface BookEntry extends HighlightType {
  id: number;
}
