import { useCallback, useEffect, useState } from "react";
import { BiMenu, BiX, BiAdjust } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

//TODO: navbar rerenders

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  function handleOpen() {
    setIsOpen(!isOpen);
  }

  const applyTheme = useCallback(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  function toggleDarkMode() {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
    applyTheme();
  }

  const LINKS = [
    {
      text: "Highlights",
      linkTo: "/all",
    },
    {
      text: "Daily review",
      linkTo: "/review",
    },
    // {
    //   text: "About",
    //   linkTo: "/about",
    // },
  ];

  return (
    <nav className="dark:bg-neutral-800 dark:text-white dark:border-white/20 bg-white mb-4 border-solid border-b border-black/20 lg:h-[70px] h-[56px] flex justify-between items-center">
      <Link to="/" className="font-robotoSlab font-bold text-xl">
        Highlights
      </Link>
      <ul className="hidden lg:flex gap-6 text-lg">
        {LINKS.map((link, index) => (
          <li
            className={`cursor-pointer ${
              location.pathname.startsWith(link.linkTo) ? "font-medium" : ""
            }`}
            key={index}
          >
            <Link to={link.linkTo}>{link.text}</Link>
          </li>
        ))}

        <li>
          <button className="px-2" onClick={toggleDarkMode}>
            <BiAdjust />
          </button>
        </li>
      </ul>
      <button onClick={handleOpen} className="lg:hidden cursor-pointer">
        <BiMenu size={28} />
      </button>
      {isOpen && (
        <div className="grid place-items-center bg-neutral-100 dark:bg-neutral-800 fixed top-0 bottom-0 right-0 left-0 w-full h-screen">
          <div className="w-full max-w-[568px] lg:max-w-[1168px] text-xl h-screen flex flex-col">
            <div className="px-4 text-right flex justify-end h-[56px]">
              <button onClick={handleOpen}>
                <BiX size={32} />
              </button>
            </div>
            <div className="w-full flex flex-col gap-2">
              {LINKS.map((link, index) => (
                <Link
                  key={index}
                  to={link.linkTo}
                  className="border-b border-black/20 dark:border-white/20 w-full p-4 text-center"
                >
                  {link.text}
                </Link>
              ))}
              <button
                className="border-b border-black/20 dark:border-white/20 w-full p-4 text-center"
                onClick={toggleDarkMode}
              >
                Toggle Dark Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
