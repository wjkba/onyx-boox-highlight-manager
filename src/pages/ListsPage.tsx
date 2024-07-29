import { db } from "@/db";
import { Layout } from "@/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { BiSolidStar } from "react-icons/bi";
import { useState } from "react";

interface ListProps {
  listId: number;
  listName: string;
}

export default function ListsPage() {
  const lists = useLiveQuery(() => db.lists.toArray());
  const [isFormActive, setIsFormActive] = useState(false);

  function List({ listId, listName }: ListProps) {
    return (
      <Link
        to={`/lists/${listId}`}
        className=" flex gap-2 items-center p-4 border dark:border-white border-black  w-full dark:hover:bg-neutral-900  hover:bg-neutral-50"
      >
        <p className="text-lg">{listName}</p>
      </Link>
    );
  }

  function StarredList() {
    return (
      <Link
        to={`/starred`}
        className=" flex gap-2 items-center p-4 border dark:border-white border-black  w-full dark:hover:bg-neutral-900  hover:bg-neutral-50"
      >
        <BiSolidStar />
        <p className="text-lg">Starred</p>
      </Link>
    );
  }

  function AddNewList() {
    const [newListName, setNewListName] = useState<string>("New list");

    function handleNewListNameChange(
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      setNewListName(event.target.value);
    }

    function handleFormSubmit(event: React.FormEvent) {
      event.preventDefault();
      console.log(newListName);
      db.lists.add({ name: newListName, quotes: [] });
      setIsFormActive(false);
    }

    if (!isFormActive) {
      return (
        <button
          onClick={() => setIsFormActive(!isFormActive)}
          className=" max-w-[276px] p-2 mb-4 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
        >
          Add new list
        </button>
      );
    }

    return (
      <form onSubmit={handleFormSubmit} className="mb-4 lg:max-w-[276px]">
        <h1 className="text-xl mb-2">Add new list</h1>
        <div className="grid gap-1">
          <input
            type="text"
            className="mb-1 py-2 px-2 w-full border text-lg border-black dark:border-white dark:bg-neutral-900"
            placeholder="Enter list name"
            value={newListName}
            onChange={handleNewListNameChange}
          />
          <button
            type="submit"
            className="p-2 w-full border border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Add list
          </button>
          <button
            type="submit"
            onClick={() => setIsFormActive(false)}
            className="p-2 w-full  border-black  hover:bg-neutral-800 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (!lists || lists.length <= 0) {
    return (
      <Layout>
        <div className="mb-4">
          <StarredList />
        </div>
        <AddNewList />
        <p>Your lists will appear here</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-2 mb-4">
        <StarredList />
        {lists.map((list, index) => (
          <List listId={list.id} listName={list.name} key={index} />
        ))}
      </div>
      <AddNewList />
    </Layout>
  );
}
