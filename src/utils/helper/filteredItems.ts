import { Item } from '../../Interfaces';

export const filteredItems = (items : Item[], parents: Item[]) : Item[] => {
    if(parents.length === 0) {
        return items.filter(i => i.children.length > 0);
    }
    const lastEl = parents[parents.length - 1];
    return lastEl.children;
}