import { db } from "@/lib/db/client";
import type { NewHighlight } from "@/lib/db/types";
export const getExportBooks = () => db.books.toArray();
export const getBookHighlightsForExport = (bookTitle: string) =>
  db.books.get({ bookTitle }).then((book) => book ? db.highlights.where("bookId").equals(book.id).toArray() : []);
export const getExportBook = (bookTitle: string) => db.books.get({ bookTitle });

const normalizeBookPart = (value: string) =>
  value.normalize("NFKC").replace(/\s+/gu, " ").trim().toLowerCase();

export const importHighlights = async (bookTitle: string, bookAuthor: string, highlights: NewHighlight[]) =>
  db.transaction("rw", db.books, db.highlights, async () => {
    const title = normalizeBookPart(bookTitle);
    const author = normalizeBookPart(bookAuthor);
    const matchingBooks = (await db.books.toArray()).filter(
      (book) => normalizeBookPart(book.bookTitle) === title && normalizeBookPart(book.bookAuthor) === author,
    );
    const canonicalBook = matchingBooks.sort((first, second) => first.id - second.id)[0];
    const bookId = canonicalBook?.id ?? await db.books.add({ bookTitle, bookAuthor });
    const duplicateIds = matchingBooks.filter((book) => book.id !== bookId).map(({ id }) => id);

    if (duplicateIds.length > 0) {
      const duplicateHighlights = await db.highlights.where("bookId").anyOf(duplicateIds).toArray();
      await db.highlights.bulkPut(duplicateHighlights.map((highlight) => ({ ...highlight, bookId })));
      await db.books.bulkDelete(duplicateIds);
    }

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
