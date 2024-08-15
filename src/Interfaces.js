export const categoryItem = [
    { id: 1, value: 'Setup', single: 1 },
    { id: 2, value: 'Praca', single: 0 },
    { id: 3, value: 'Awaria', single: 3 },
    { id: 4, value: 'Przerwa', single: 1 },
];

export const categoryAwaria = [
    { id: 3.1, value: 'Maszyny', single: 0 },
    { id: 3.2, value: 'Linia produkcyjna', single: 0 },
    { id: 3.3, value: 'Składniki', single: 0 },
];

export function timeElement( startDate, endDate, categoryNumber )  {
    //
   return  {
      startDate: startDate,
      endDate: endDate,
      category: categoryNumber,
    };
}



