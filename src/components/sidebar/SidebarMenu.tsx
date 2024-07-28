import { ReactNode } from "react";
import SidebarMenuButton from "./SidebarMenuButton";
import { BiSolidQuoteRight } from "react-icons/bi";
import { BiSolidBook } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { BiPlusCircle } from "react-icons/bi";
import { BiExport } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

// type SidebarMenuProps = {
//   activePage: string;
// };

type Button = {
  text: string;
  icon: ReactNode;
  page: string;
};

type ButtonArray = Button[];

export default function SidebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname;

  const buttons: ButtonArray = [
    {
      text: "All Highlights",
      icon: <BiSolidQuoteRight size={32} />,
      page: "/all",
    },
    {
      text: "Books",
      icon: <BiSolidBook size={32} />,
      page: "/books",
    },
    {
      text: "Starred",
      icon: <BiSolidStar size={32} />,
      page: "/starred",
    },
    {
      text: "Import",
      icon: <BiPlusCircle size={32} />,
      page: "/import",
    },
    {
      text: "Export",
      icon: <BiExport size={32} />,
      page: "/export",
    },
    {
      text: "Settings",
      icon: <BiCog size={32} />,
      page: "/settings",
    },
  ];

  function setActive(page: string) {
    navigate(page);
  }

  return (
    <div className="grid grid-cols-3 mb-4 lg:flex lg:flex-col lg:w-full lg:max-w-[276px]">
      {buttons.map((button, index) => (
        <SidebarMenuButton
          key={index}
          id={index}
          text={button.text}
          icon={button.icon}
          page={button.page}
          active={activePage.startsWith(button.page) ? true : undefined}
          setActive={setActive}
        />
      ))}
    </div>
  );
}
