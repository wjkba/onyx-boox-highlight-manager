import { db } from "@/lib/db/client";
import type { List } from "@/lib/db/types";

export const getLists = () => db.lists.toArray();
export const getList = (listId: number) => db.lists.get(listId);
export const getListsByIds = (ids: number[]) => db.lists.bulkGet(ids);
export const addList = (list: Omit<List, "id">) => db.lists.add(list);
export const updateList = (listId: number, changes: Partial<List>) => db.lists.update(listId, changes);
export const deleteList = (listId: number) => db.lists.delete(listId);
export const getListHighlights = (ids: number[]) => db.highlights.bulkGet(ids);
export const getListBooks = () => db.books.toArray();
