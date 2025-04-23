import { Item } from "../../interfaces/Interfaces";

export const getPath = (item: Item | null, parents: Item[]): string => {
    if(!item) return "";
    const pathArray = [...parents.map((p) => p.name), item.name];
    return pathArray.join(" / ");
}