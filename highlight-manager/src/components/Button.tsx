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
      className={`${className} border border-black 
                active:bg-neutral-800 active:text-white 
                dark:active:bg-white dark:active:text-black
                can-hover:hover:bg-neutral-800 
                can-hover:hover:text-white 
                dark:border-white 
                can-hover:dark:hover:bg-white 
                can-hover:dark:hover:text-black 
                text-black dark:text-white`}
      {...rest}
    >
      {text}
    </button>
  );
}
