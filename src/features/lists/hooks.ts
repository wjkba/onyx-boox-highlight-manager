import { useLiveQuery } from "dexie-react-hooks";
import { getList, getLists, getListBooks, getListHighlights } from "./api";

export const useLists = () => useLiveQuery(getLists);
export const useList = (listId: number) => useLiveQuery(() => getList(listId), [listId]);
export const useListBooks = () => useLiveQuery(getListBooks);
export const useListHighlights = (ids: number[]) => useLiveQuery(() => getListHighlights(ids), [ids]);
