export interface CurrentCategoryProps {
    timeIsRuning: boolean;
    parents: Item[];
    setParents: React.Dispatch<React.SetStateAction<Item[]>>;
    setButtonsLoad: React.Dispatch<React.SetStateAction<boolean>>;
    setSingleItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export interface BreadcrumbsProps {
    timeIsRuning: boolean;
    parents: Item[];
    singleItem: Item | null;
    setParents: React.Dispatch<React.SetStateAction<Item[]>>;
    setSingleItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export interface TimeElement {
  startDate: Date;
  endDate: Date;
  path: string;
}
 export interface Item {
  name: string;
  children: Item[];
}
