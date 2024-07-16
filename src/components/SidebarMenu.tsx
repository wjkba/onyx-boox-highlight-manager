import { ReactNode, useState } from "react";
import SidebarMenuButton from "./SidebarMenuButton";
import { BiSolidQuoteRight } from "react-icons/bi";
import { BiSolidBook } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { BiPlusCircle } from "react-icons/bi";
import { BiExport } from "react-icons/bi";
import { BiCog } from "react-icons/bi";

type Button = {
  text: string;
  icon: ReactNode;
};

type ButtonArray = Button[];

export default function SidebarMenu() {
  const [activeButton, setActiveButton] = useState(0);

  const buttons: ButtonArray = [
    {
      text: "All Highlights",
      icon: <BiSolidQuoteRight size={32} />,
    },
    {
      text: "Books",
      icon: <BiSolidBook size={32} />,
    },
    {
      text: "Starred",
      icon: <BiSolidStar size={32} />,
    },
    {
      text: "Import",
      icon: <BiPlusCircle size={32} />,
    },
    {
      text: "Export",
      icon: <BiExport size={32} />,
    },
    {
      text: "Settings",
      icon: <BiCog size={32} />,
    },
  ];

  return (
    <div className="grid grid-cols-3 mb-4">
      {buttons.map((button, index) => (
        <SidebarMenuButton
          key={index}
          id={index}
          text={button.text}
          icon={button.icon}
          active={index === activeButton ? true : undefined}
          setActiveButton={setActiveButton}
        />
      ))}
    </div>
  );
}
