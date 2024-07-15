import SidebarMenuButton from "./SidebarMenuButton";

export default function SidebarMenu() {
  return (
    <div className="grid grid-cols-3 mb-4">
      <SidebarMenuButton active />
      <SidebarMenuButton />
      <SidebarMenuButton />
      <SidebarMenuButton />
      <SidebarMenuButton />
      <SidebarMenuButton />
    </div>
  );
}
