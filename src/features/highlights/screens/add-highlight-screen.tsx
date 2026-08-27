import type { ElementType } from "react";

export default function AddHighlightScreen({
  AddHighlightComponent,
}: {
  AddHighlightComponent: ElementType;
}) {
  return (
    <div className="lg:max-w-[640px]">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Add Highlight</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Paste quotes one after another. The book stays set until you change
          it, so you can batch a chapter without retyping the details.
        </p>
      </div>

      <AddHighlightComponent />
    </div>
  );
}
