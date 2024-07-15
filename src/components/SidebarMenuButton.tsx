type SidebarMenuButtonProps = {
  active?: boolean;
};

export default function SidebarMenuButton({
  active = false,
}: SidebarMenuButtonProps) {
  return (
    <div
      className={`${
        active ? "bg-neutral-700 text-white" : "bg-white"
      } flex flex-col w-full items-center cursor-pointer`}
    >
      <div>X</div>
      <div>Button</div>
    </div>
  );
}
