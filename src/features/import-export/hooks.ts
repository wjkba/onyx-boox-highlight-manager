import { useLiveQuery } from "dexie-react-hooks";
import { getExportBooks } from "./api";
export const useExportBooks = () => useLiveQuery(getExportBooks);
