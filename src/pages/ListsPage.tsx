import { db } from "@/db";
import { Layout } from "@/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { BiSolidStar } from "react-icons/bi";
import { useState } from "react";
import ListOptions from "@/components/ListOptions";
import Button from "@/components/Button";

interface ListProps {
  listId: number;
  listName: string;
}

export default function ListsPage() {
  const lists = useLiveQuery(() => db.lists.toArray());
  const [isFormActive, setIsFormActive] = useState(false);
  const [activeOption, setActiveOption] = useState<number | null>(null);

  function List({ listId, listName }: ListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newName, setNewName] = useState(listName);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
      setNewName(event.target.value);
    }
    async function handleEditConfirm(event: React.FormEvent) {
      event.preventDefault();
      if (newName.length > 0) {
        const result = await db.lists.update(listId, { name: newName });
        console.log(result);
      }
    }

    function handleCancel() {
      setActiveOption(null);
      setIsEditing(false);
      setIsDeleting(false);
    }

    async function handleDeleteConfirm(event: React.FormEvent) {
      event.preventDefault();
      const result = await db.lists.delete(listId);
      console.log(result);
      handleCancel();
    }

    if (isDeleting) {
      return (
        <div className=" p-4 justify-between gap-2 items-center border dark:border-white border-black  w-full dark:hover:bg-neutral-900  hover:bg-neutral-50">
          <p className="mb-2">You are about to delete {listName}</p>
          <form
            onSubmit={handleDeleteConfirm}
            className="lg:flex grid gap-2 w-full"
          >
            <Button type="submit" className="p-2 w-full" text="Confirm" />
            <Button
              onClick={handleCancel}
              type="button"
              className="p-2 w-full border-none"
              text="Cancel"
            />
          </form>
        </div>
      );
    }

    return (
      <div className="flex justify-between gap-2 items-center border dark:border-stone-500 border-stone-400  w-full dark:hover:bg-neutral-900  hover:bg-stone-100">
        {!isEditing ? (
          <>
            <Link to={`/lists/${listId}`} className="text-lg p-4  w-[90%]">
              {listName}
            </Link>
            <div className="flex h-full items-start">
              <ListOptions
                activeOption={activeOption}
                listId={listId}
                setActiveOption={setActiveOption}
                setIsEditing={setIsEditing}
                setIsDeleting={setIsDeleting}
              />
            </div>
          </>
        ) : (
          <form
            onSubmit={handleEditConfirm}
            className="p-4 w-full lg:flex  gap-2 items-center"
          >
            <input
              value={newName}
              onChange={handleNameChange}
              className="w-full mb-2 lg:m-0 p-1 border text-lg border-black dark:border-white dark:bg-neutral-900"
            />
            <div className="lg:flex grid gap-2 w-full">
              <Button type="submit" className="p-2 w-full" text="Confirm" />
              <Button
                onClick={handleCancel}
                type="button"
                className="p-2 w-full border-none"
                text="Cancel"
              />
            </div>
          </form>
        )}
      </div>
    );
  }

  function StarredList() {
    return (
      <Link
        to={`/starred`}
        className=" flex gap-2 items-center p-4 border dark:border-stone-500 border-stone-400  w-full dark:hover:bg-neutral-900  hover:bg-stone-100"
      >
        <BiSolidStar size={20} />
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
      db.lists.add({ name: newListName, highlightIds: [] });
      setIsFormActive(false);
    }

    if (!isFormActive) {
      return (
        <Button
          text="Add a new list"
          type="button"
          onClick={() => setIsFormActive(!isFormActive)}
          className="max-w-[276px] p-2 mb-4 w-full"
        />
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
          <Button type="submit" className="p-2 w-full" text="Add list" />
          <Button
            onClick={() => setIsFormActive(false)}
            type="button"
            className="p-2 w-full border-none"
            text="Cancel"
          />
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
        <p className="mb-2">Your lists will appear here</p>
        <AddNewList />
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
