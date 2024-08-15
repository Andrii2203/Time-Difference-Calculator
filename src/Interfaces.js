export const categoryItem = [
    { id: 1, value: 'Setup', single:1},
    { id: 2, value: 'Praca', single: 0 },
    { id: 3, value: 'Awaria',single: 0 },
    { id: 4, value: 'Przerwa',single: 1 },
];

export function timeElement(startDate, endDate, categoryNumber )  {
    //
   return  {
      startDate: startDate,
      endDate: endDate,
      category: categoryNumber,
    };
}



