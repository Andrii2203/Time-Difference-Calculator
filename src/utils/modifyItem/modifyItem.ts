import { produce } from "immer";
import { Item } from "../../interfaces/Interfaces";

export const modifyItem = (
  items: Item[],
  mode: 'addMeta' | 'removeItem',
  targetName: string,
  metaData?: Record<string, any>
): Item[] => {
  const recursive = (nodes: Item[]): void => {
    nodes.forEach((node, index) => {
      if (node.name === targetName) {
        if (mode === 'addMeta') {
          node.meta = { ...node.meta, ...metaData };
        }
        if (mode === 'removeItem') {
          nodes.splice(index, 1, ...node.children);
        }
      } else {
        recursive(node.children);
      }
    });
  };

  return produce(items, (draft) => {
    recursive(draft);
  });
}
