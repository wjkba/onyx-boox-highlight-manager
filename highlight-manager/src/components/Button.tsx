import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
}

export default function Button({
  text,
  className = " ",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${className} border border-black active:bg-neutral-800 dark:active:bg-white hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black`}
      {...rest}
    >
      {text}
    </button>
  );
}
