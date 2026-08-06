import { useLiveQuery } from "dexie-react-hooks";
import { getSettingsBooks } from "./api";
export const useSettingsBooks = () => useLiveQuery(getSettingsBooks);
