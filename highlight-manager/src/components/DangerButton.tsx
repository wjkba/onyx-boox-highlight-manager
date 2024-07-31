import { useEffect, useState } from "react";

interface DangerButtonProps {
  action: () => void;
}

export default function DangerButton({ action }: DangerButtonProps) {
  const [isSure, setIsSure] = useState<null | boolean>(null);

  useEffect(() => {
    if (isSure === true) {
      action();
    }
  }, [isSure, action]);

  function handleAction() {
    if (isSure === null) {
      setIsSure(false);
    }
  }

  function handleSure() {
    setIsSure(true);
  }

  function handleCancel() {
    setIsSure(null);
  }

  if (isSure === false) {
    return (
      <>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="text-neutral-400 border-black p-2 hover:text-black border"
          >
            Cancel
          </button>
          <button
            onClick={handleSure}
            className="bg-red-600 text-white border-black p-2 hover:bg-black border"
          >
            Confirm
          </button>
        </div>
      </>
    );
  }

  return (
    <button
      onClick={handleAction}
      className="text-red-600   hover:border-black border border-transparent hover:text-red-500 py-2"
    >
      CLEAR DATABASE TABLE
    </button>
  );
}
