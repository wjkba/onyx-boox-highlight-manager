import { useLiveQuery } from "dexie-react-hooks";
import { getBook, getBooks, getBookHighlights } from "./api";

export const useBooks = () => useLiveQuery(getBooks);
export const useBook = (bookId: number) => useLiveQuery(() => getBook(bookId), [bookId]);
export const useBookHighlights = (bookId: number) => useLiveQuery(() => getBookHighlights(bookId), [bookId]);
