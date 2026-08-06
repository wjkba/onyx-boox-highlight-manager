import { db } from "@/lib/db/client";
import type { Book } from "@/lib/db/types";

export const getBooks = () => db.books.toArray();
export const getBook = (bookId: number) => db.books.get(bookId);
export const findBook = (bookTitle: string) => db.books.get({ bookTitle });
export const addBook = (book: Omit<Book, "id">) => db.books.add(book);
export const updateBook = (bookId: number, changes: Partial<Book>) =>
  db.books.update(bookId, changes);
export const deleteBook = (bookId: number) => db.books.where("id").equals(bookId).delete();
export const deleteBookHighlights = (bookId: number) =>
  db.highlights.where("bookId").equals(bookId).delete();
export const getBookHighlights = (bookId: number) => db.highlights.where("bookId").equals(bookId).toArray();
