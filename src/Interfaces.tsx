export interface CategoryItem {
    id: number;
    value: string;
    single: number;
}
export interface CategoryAwaria {
    id: number;
    value: string;
    single: number;
}
export const categoryItem: CategoryItem[] = [
    { id: 1, value: 'Setup', single: 1 },
    { id: 2, value: 'Praca', single: 0 },
    { id: 3, value: 'Awaria', single: 3 },
    { id: 4, value: 'Przerwa', single: 1 },
];

export const categoryAwaria: CategoryAwaria[] = [
    { id: 3.1, value: 'Maszyny', single: 0 },
    { id: 3.2, value: 'Linia produkcyjna', single: 0 },
    { id: 3.3, value: 'Składniki', single: 0 },
];

export interface TimeElement {
    startDate: Date;
    endDate: Date;
    category: number;

}
export const createTimeElement = ( startDate: Date, endDate: Date, categoryNumber: number ): TimeElement =>  {
   return  {
      startDate: startDate,
      endDate: endDate,
      category: categoryNumber,
    };
}



