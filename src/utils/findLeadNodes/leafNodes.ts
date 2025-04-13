import { Item } from "../../Interfaces";

export const findLeadNodes = (items: Item[]): Item[] => {
    let leaf: Item[] = [];
    const traverse = (nodes: Item[]) => {
        nodes.forEach(node => {
            if(node.children.length === 0) {
                leaf.push(node);
            } else {
                traverse(node.children);
            }
        });
    };
    traverse(items);
    return leaf;
}
