import { BiSearch } from "react-icons/bi";

interface SearchBarProps {
  setSearchValue: (value: string) => void;
}

export default function SearchBar({ setSearchValue }: SearchBarProps) {
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="text-neutral-500 py-1.5 w-full flex items-center border-solid border-2 border-neutral-500 dark:border-neutral-100 ">
      <div className="pl-4">
        <BiSearch size={20} />
      </div>
      <input
        onChange={handleSearch}
        className="p-2 w-full h-full outline-none text-black dark:text-white dark:bg-neutral-800"
        placeholder="Search"
      />
    </div>
  );
}
