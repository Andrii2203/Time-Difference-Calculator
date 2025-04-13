import React from "react";
import { Item } from "../../Interfaces";

interface RenderItemsProps {
  items: Item[];
  singleItem: Item | null;
  disableBtn: boolean;
  handleSelectItem: (item: Item) => void;
}

export const RenderLeaf: React.FC<RenderItemsProps> = ({ items, singleItem, disableBtn, handleSelectItem }) => {
  return (
    <>
      {items.map((child) => (
        <div key={child.name}>
          <button
            onClick={() => handleSelectItem(child)}
            className={singleItem?.name === child.name ? "selected" : "not-selected"}
            disabled={disableBtn}
          >
            {child.name}
          </button>
        </div>
      ))}
    </>
  );
};
