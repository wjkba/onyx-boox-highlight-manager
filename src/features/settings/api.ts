import { db } from "@/lib/db/client";
export const getSettingsBooks = () => db.books.toArray();
