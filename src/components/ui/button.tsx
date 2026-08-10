import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Legacy prop retained for existing call sites. Prefer children for new buttons. */
  text?: string;
  variant?: ButtonVariant;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-neutral-900 bg-transparent text-neutral-900 can-hover:hover:bg-neutral-100 can-hover:hover:text-neutral-900 active:bg-neutral-900 active:text-white dark:border-neutral-100 dark:bg-transparent dark:text-neutral-100 can-hover:dark:hover:bg-neutral-800 can-hover:dark:hover:text-neutral-100 dark:active:bg-neutral-900 dark:active:text-white",
  secondary:
    "border-neutral-900 bg-transparent text-neutral-900 can-hover:hover:bg-neutral-100 can-hover:hover:text-neutral-900 active:bg-neutral-900 active:text-white dark:border-neutral-100 dark:bg-transparent dark:text-neutral-100 can-hover:dark:hover:bg-neutral-800 can-hover:dark:hover:text-neutral-100 dark:active:bg-neutral-900 dark:active:text-white",
  ghost:
    "border-transparent bg-transparent text-neutral-700 can-hover:hover:border-stone-300 can-hover:hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 can-hover:dark:hover:border-stone-600 can-hover:dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    text,
    variant = "secondary",
    className = "",
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[baseClasses, variantClasses[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children ?? text}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
