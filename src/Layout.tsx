import { ReactNode } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <SidebarMenu />
          <div className="lg:w-full">{children}</div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};
