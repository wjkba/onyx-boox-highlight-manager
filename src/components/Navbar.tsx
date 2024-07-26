import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="bg-white mb-4 border-solid border-b border-black/20 h-[56px] flex justify-between items-center">
      <Link to="/" className="font-robotoSlab font-bold text-xl">
        Highlights
      </Link>
      <button onClick={handleOpen} className="cursor-pointer">
        <BiMenu size={28} />
      </button>
      {isOpen && (
        <div className="grid place-items-center bg-neutral-100 fixed top-0 bottom-0 right-0 left-0 w-full h-screen">
          <div className="w-full max-w-[568px] lg:max-w-[1168px] text-xl h-screen flex flex-col">
            <div className="text-right flex justify-end h-[56px]">
              <button onClick={handleOpen}>
                <BiX size={28} />
              </button>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Link
                to="/"
                className="border-b border-black/20  w-full p-4 text-center"
              >
                Highlights
              </Link>
              <Link
                to="/review"
                className="border-b border-black/20  w-full p-4 text-center"
              >
                Daily review
              </Link>
              <Link
                to="/about"
                className="border-b border-black/20  w-full p-4 text-center"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
