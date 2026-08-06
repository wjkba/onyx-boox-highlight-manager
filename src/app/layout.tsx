import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import SidebarMenu from "@/components/layout/sidebar-menu";

function ContentFallback() {
  return (
    <div
      aria-busy="true"
      className="min-h-[240px] w-full rounded border border-black/10 p-6 dark:border-white/10"
    >
      <div className="h-4 w-1/3 rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-4 h-3 w-2/3 rounded bg-black/10 dark:bg-white/10" />
    </div>
  );
}

export const Layout = () => {
  return (
    <div className="grid place-items-center dark:bg-neutral-800 dark:text-white">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <SidebarMenu />
          <div className="lg:w-full">
            <Suspense fallback={<ContentFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};
