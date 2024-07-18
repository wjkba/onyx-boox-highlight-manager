import { BiSearch } from "react-icons/bi";

export default function SearchBar() {
  // TODO: Search function
  return (
    <div className="text-neutral-500 py-2 w-full flex items-center border-solid border-2 border-neutral-500 ">
      <div className="pl-4">
        <BiSearch size={20} />
      </div>
      <input
        className="p-2 w-full h-full outline-none text-black"
        placeholder="Search"
      />
    </div>
  );
}
