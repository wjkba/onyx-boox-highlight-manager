import { BiMenu } from "react-icons/bi";

export default function Navbar() {
  return (
    <header>
      <div className="bg-white mb-4 border-solid border-b border-black/20 h-[56px] flex justify-between items-center">
        <p className="font-robotoSlab font-bold text-xl">Highlights</p>
        <div className="cursor-pointer">
          <BiMenu size={28} />
        </div>
      </div>
    </header>
  );
}
