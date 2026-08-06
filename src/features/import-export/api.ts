import { db } from "@/lib/db/client";
import type { NewHighlight } from "@/lib/db/types";
export const getExportBooks = () => db.books.toArray();
export const getBookHighlightsForExport = (bookTitle: string) =>
  db.books.get({ bookTitle }).then((book) => book ? db.highlights.where("bookId").equals(book.id).toArray() : []);
export const getExportBook = (bookTitle: string) => db.books.get({ bookTitle });
export const importHighlights = async (bookTitle: string, bookAuthor: string, highlights: NewHighlight[]) =>
  db.transaction("rw", db.books, db.highlights, async () => {
    const foundBook = await db.books.get({ bookTitle });
    const bookId = foundBook ? foundBook.id : await db.books.add({ bookTitle, bookAuthor });
    const existing = await db.highlights.where("quote").anyOf(highlights.map(({ quote }) => quote)).toArray();
    const quotes = new Set(existing.map(({ quote }) => quote));
    const dateAdded = new Date().toISOString();
    const fresh = highlights.filter(({ quote }) => {
      if (quotes.has(quote)) return false;
      quotes.add(quote);
      return true;
    }).map((highlight) => ({ ...highlight, bookId, dateAdded }));
    await db.highlights.bulkAdd(fresh);
    return fresh.length !== highlights.length;
  });
export const getDatabase = async () => { await db.open(); return db.backendDB(); };
