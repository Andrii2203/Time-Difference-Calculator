import React from "react";
import { Item } from "../../interfaces/Interfaces";

interface DeleteLastElementButtonProps {
  setParents: React.Dispatch<React.SetStateAction<Item[]>>;
  setSingleItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export const DeleteLastElementButton: React.FC<DeleteLastElementButtonProps> = ({ setParents, setSingleItem }) => {
  const handleDeleteLastElementFromParentsArr = () => {
    setParents((prev) => prev.slice(0, prev.length - 1));
    setSingleItem(null);
  };

  return (
    <button onClick={handleDeleteLastElementFromParentsArr} className="not-selected">
      back
    </button>
  );
};

