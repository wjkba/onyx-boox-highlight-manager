import { useLiveQuery } from "dexie-react-hooks";
import { getReviewBook } from "./api";
export const useReviewBook = (bookId: number | undefined) => useLiveQuery(() => bookId === undefined ? undefined : getReviewBook(bookId), [bookId]);
