import { BiSearch } from "react-icons/bi";

interface SearchBarProps {
  setSearchValue: (value: string) => void;
}

export default function SearchBar({ setSearchValue }: SearchBarProps) {
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="text-neutral-500 py-2 w-full flex items-center border-solid border-2 border-neutral-500 ">
      <div className="pl-4">
        <BiSearch size={20} />
      </div>
      <input
        onChange={handleSearch}
        className="p-2 w-full h-full outline-none text-black"
        placeholder="Search"
      />
    </div>
  );
}
