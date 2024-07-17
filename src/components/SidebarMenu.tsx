import { ReactNode, useState } from "react";
import SidebarMenuButton from "./SidebarMenuButton";
import { BiSolidQuoteRight } from "react-icons/bi";
import { BiSolidBook } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { BiPlusCircle } from "react-icons/bi";
import { BiExport } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import AllHighlightsPage from "../pages/AllHighlightsPage";
import BooksPage from "../pages/BooksPage";
import StarredPage from "../pages/StarredPage";
import ImportPage from "../pages/ImportPage";
import ExportPage from "../pages/ExportPage";
import SettingsPage from "../pages/SettingsPage";

type SidebarMenuProps = {
  setActivePage: (activePage: ReactNode) => void;
};

type Button = {
  text: string;
  icon: ReactNode;
  page: ReactNode;
};

type ButtonArray = Button[];

export default function SidebarMenu({ setActivePage }: SidebarMenuProps) {
  const [activeButton, setActiveButton] = useState(0);

  const buttons: ButtonArray = [
    {
      text: "All Highlights",
      icon: <BiSolidQuoteRight size={32} />,
      page: <AllHighlightsPage />,
    },
    {
      text: "Books",
      icon: <BiSolidBook size={32} />,
      page: <BooksPage />,
    },
    {
      text: "Starred",
      icon: <BiSolidStar size={32} />,
      page: <StarredPage />,
    },
    {
      text: "Import",
      icon: <BiPlusCircle size={32} />,
      page: <ImportPage />,
    },
    {
      text: "Export",
      icon: <BiExport size={32} />,
      page: <ExportPage />,
    },
    {
      text: "Settings",
      icon: <BiCog size={32} />,
      page: <SettingsPage />,
    },
  ];

  function setActive(index: number) {
    setActiveButton(index);
    setActivePage(buttons[index].page);
  }

  return (
    <div className="grid grid-cols-3 mb-4">
      {buttons.map((button, index) => (
        <SidebarMenuButton
          key={index}
          id={index}
          text={button.text}
          icon={button.icon}
          active={index === activeButton ? true : undefined}
          setActive={setActive}
        />
      ))}
    </div>
  );
}
