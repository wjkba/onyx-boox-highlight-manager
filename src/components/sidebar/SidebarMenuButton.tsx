import { ReactNode } from "react";

type SidebarMenuButtonProps = {
  active?: boolean;
  id: number;
  page: string;
  text: string;
  icon: ReactNode;
  setActive: (page: string) => void;
};

export default function SidebarMenuButton({
  active = false,
  page,
  text,
  icon,
  setActive,
}: SidebarMenuButtonProps) {
  const buttonClasses = `${
    active
      ? "dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-800 text-white "
      : "bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
  }  flex flex-col w-full items-center cursor-pointer p-2 gap-1 lg:gap-[12px] lg:flex-row`;

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={() => setActive(page)}
    >
      <div>{icon}</div>
      <div>{text}</div>
    </button>
  );
}
