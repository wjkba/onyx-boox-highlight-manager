import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "checked" | "onChange" | "role"
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onCheckedChange, className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={[
        "relative inline-flex min-h-11 items-center gap-2 border border-neutral-900 bg-transparent px-2",
        "can-hover:hover:bg-neutral-100 active:bg-neutral-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        "dark:border-neutral-100 dark:bg-transparent can-hover:dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
        "dark:focus-visible:outline-neutral-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span
        className={[
          "relative h-7 w-14 overflow-hidden border border-neutral-900 dark:border-neutral-100 transition-colors",
          checked
            ? "bg-neutral-900 dark:bg-neutral-100"
            : "bg-neutral-100 dark:bg-neutral-900",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={[
            "absolute top-1 left-1 h-5 w-5 border border-neutral-900 dark:border-neutral-100 transition-transform duration-200 ease-out",
            checked
              ? "translate-x-7 bg-neutral-100 dark:bg-neutral-900"
              : "translate-x-0 bg-neutral-900 dark:bg-neutral-100",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </span>
    </button>
  );
});

Switch.displayName = "Switch";

export default Switch;
