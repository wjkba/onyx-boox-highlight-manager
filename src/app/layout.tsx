import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import SidebarMenu from "@/components/layout/sidebar-menu";

export const Layout = () => {
  return (
    <div className="grid place-items-center dark:bg-neutral-800 dark:text-white">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <SidebarMenu />
          <div className="lg:w-full"><Outlet /></div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};
