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
    active ? "bg-neutral-800 text-white" : "bg-white text-neutral-800"
  } flex flex-col w-full items-center cursor-pointer p-2 gap-1`;

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
