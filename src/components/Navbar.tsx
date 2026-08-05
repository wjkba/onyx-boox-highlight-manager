import { useCallback, useEffect, useState } from "react";
import { BiMenu, BiX, BiAdjust } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  function handleOpen() {
    setIsOpen((open) => !open);
  }

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (location.pathname) closeMenu();
  }, [closeMenu, location.pathname]);
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
    const metaThemeColor = document.getElementById("meta-theme-color");
    if (localStorage.theme === "dark") {
      metaThemeColor?.setAttribute("content", "#ffffff");
      localStorage.theme = "light";
    } else {
      metaThemeColor?.setAttribute("content", "#262626");
      localStorage.theme = "dark";
    }
    applyTheme();
  }

  const LINKS = [
    {
      text: "All Highlights",
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

  function NavModalMobile() {
    return (
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="grid place-items-center bg-neutral-100 dark:bg-neutral-800 fixed inset-0 z-50 w-full h-dvh">
        <div className="w-full max-w-[568px] lg:max-w-[1168px] text-xl h-dvh flex flex-col">
          <div className="p-4 text-right flex justify-end h-[56px]">
            <button type="button" onClick={closeMenu} aria-label="Close navigation menu" className="grid min-h-11 min-w-11 place-items-center">
              <BiX size={30} />
            </button>
          </div>
          <div className="w-full flex flex-col gap-2">
            {LINKS.map((link) => (
              <Link
                key={link.linkTo}
                to={link.linkTo}
                onClick={closeMenu}
                className="flex min-h-12 items-center border-b border-black/20 dark:border-white/20 w-full p-4 text-left"
              >
                {link.text}
              </Link>
            ))}
            <button
              type="button"
              className="flex min-h-12 items-center border-b border-black/20 dark:border-white/20 w-full p-4 text-left"
              onClick={() => { toggleDarkMode(); closeMenu(); }}
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="dark:bg-neutral-800 dark:text-white dark:border-white/20 bg-white mb-4 border-solid border-b border-black/20 lg:h-[70px] h-[56px] flex justify-between items-center">
      <Link to="/" className="font-robotoSlab font-bold text-xl">
        Highlights
      </Link>
      <ul className="hidden lg:flex gap-6 text-lg">
        {LINKS.map((link) => (
          <li
            className={`cursor-pointer ${
              location.pathname.startsWith(link.linkTo) ? "font-medium" : ""
            }`}
            key={link.linkTo}
          >
            <Link to={link.linkTo}>{link.text}</Link>
          </li>
        ))}

        <li className="flex items-center">
          <button type="button" className="px-2 min-h-11 min-w-11" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
            <BiAdjust />
          </button>
        </li>
      </ul>
      <button type="button" onClick={handleOpen} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" className="lg:hidden cursor-pointer grid min-h-11 min-w-11 place-items-center">
        <BiMenu size={28} />
      </button>
      {isOpen && <NavModalMobile />}
    </nav>
  );
}
