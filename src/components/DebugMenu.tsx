import { useHighlightsStore } from "../store";

export default function DebugMenu() {
  const highlights = useHighlightsStore((store) => store.highlights);

  return (
    <div className="bg-yellow-200 mb-2  text-white p-2">
      <button onClick={() => console.log(highlights)} className="p-2 bg-black">
        console.log(highlights)
      </button>
    </div>
  );
}
