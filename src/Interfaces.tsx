export interface TimeElement {
  startDate: Date;
  endDate: Date;
  path: string;
}

export interface TimeDifferenceCalculatorProps {
  filteredCategories: Item[];
  currentCategry: string;
}
export interface Item {
  name: string;
  children: Item[];
}