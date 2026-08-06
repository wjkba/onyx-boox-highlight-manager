import { db, deleteHighlight as removeHighlight, deleteHighlights as removeHighlights } from "@/lib/db/client";
import type { Book, Highlight, NewHighlight } from "@/lib/db/types";
export const findBook = (bookTitle: string) => db.books.get({ bookTitle });
export const addBook = (book: Omit<Book, "id">) => db.books.add(book);

export const getRecentHighlights = () =>
  db.highlights.orderBy("dateAdded").reverse().limit(3).toArray();
export const getAllHighlights = (sortOption: string, sortOrder: "asc" | "desc") => {
  const table = sortOption === "dateAdded" ? "dateAdded" : sortOption === "alphabet" ? "quote" : "date";
  const query = db.highlights.orderBy(table);
  return sortOrder === "desc" ? query.reverse().toArray() : query.toArray();
};
export const getStarredHighlights = () =>
  db.highlights.filter((highlight) => highlight.starred === true).toArray();
export const getHighlight = (highlightId: number) => db.highlights.get(highlightId);
export const getHighlightBook = (bookId: number) => db.books.get(bookId);
export const getHighlightsForBook = (bookId: number) =>
  db.highlights.where("bookId").equals(bookId).toArray();
export const getHighlightsByIds = (ids: number[]) => db.highlights.bulkGet(ids);
export const getBooksForHighlights = (highlights: Highlight[]) =>
  db.books.bulkGet([...new Set(highlights.map((highlight) => highlight.bookId))]).then((books) =>
    books.reduce<Record<number, Book>>((result, book) => {
      if (book) result[book.id] = book;
      return result;
    }, {}),
  );
export const addHighlight = (highlight: NewHighlight & { bookId: number }) =>
  db.highlights.add(highlight as Highlight);
export const updateHighlight = (highlightId: number, changes: Partial<Highlight>) =>
  db.highlights.update(highlightId, changes);
export const getAllLists = () => db.lists.toArray();
export const getList = (listId: number) => db.lists.get(listId);
export const saveList = (listId: number, changes: { highlightIds?: number[]; name?: string }) => db.lists.update(listId, changes);
export const getListsByIds = (ids: number[]) => ids.length ? db.lists.bulkGet(ids) : db.lists.toArray();
export const deleteHighlight = (highlightId: number) => removeHighlight(highlightId);
export const deleteHighlights = (highlightIds: number[]) => removeHighlights(highlightIds);
