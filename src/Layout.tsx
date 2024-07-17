import { ReactNode } from "react";
import Navbar from "./components/Navbar";
import DebugMenu from "./components/DebugMenu";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[450px] px-4">
        {/* <DebugMenu /> */}
        <Navbar />
        <main className="bg-white min-h-screen">{children}</main>
        <footer></footer>
      </div>
    </div>
  );
};