import { Item } from '../../interfaces/Interfaces';

export const filteredItems = (items : Item[], parents: Item[]) : Item[] => {
    if(parents.length === 0) {
        return items.filter(i => i.children.length > 0);
    }
    const lastEl = parents[parents.length - 1];
    const exclusiveItem = lastEl.children.find(child => child.meta?.exclusive);
    console.log('exclusiveItem', exclusiveItem);

    if(exclusiveItem) {
      return [exclusiveItem];
    }
    return lastEl.children;
}