export interface CategoryAwaria {
    id: number;
    value: string;
    single: number;
    parent: number;
}
export const categoryAwaria: CategoryAwaria[] = [
    { id: 0, value: 'Prygotowanie', single: 1, parent: -1 },
    { id: 2, value: 'Praca', single: 2, parent: -1 },
    { id: 3, value: 'Awaria', single: 3, parent: -1 },
    { id: 4, value: 'Przerwa', single: 1, parent: -1 },
    { id: 5, value: 'Silosy', single: 0, parent: 3 },
    { id: 6, value: 'Zbiorniki Mikro', single: 0, parent: 3 },
    { id: 7, value: 'Podajnik Worków', single: 0, parent: 3 },
    { id: 8, value: 'Adams', single: 0, parent: 3 },
    { id: 9, value: 'Taśmy', single: 0, parent: 3 },
    { id: 10, value: 'EtyieCiarka', single: 0, parent: 3 },
    { id: 11, value: 'Drukarka', single: 0, parent: 3 },
    { id: 12, value: 'Paletpac', single: 0, parent: 3 },
    { id: 13, value: 'Strech-Hord', single: 0, parent: 3 },
    { id: 14, value: 'Brak Zasypu', single: 0, parent: 3 },
    { id: 15, value: 'Mieszalnik', single: 0, parent: 3 },
    { id: 16, value: 'Kosz Podmieszarkowy', single: 0, parent: 3 },
    { id: 17, value: 'Hangar', single: 0, parent: 3 },
    { id: 18, value: 'Radimat', single: 0, parent: 3 },
    { id: 19, value: 'Taśmociąg', single: 0, parent: 3 },
    { id: 20, value: 'Drukarka', single: 0, parent: 3 },
    { id: 21, value: 'Robot', single: 0, parent: 3 },
    { id: 22, value: 'Podajnik Palet', single: 0, parent: 3 },
    { id: 23, value: 'Rolotoki', single: 0, parent: 3 },
    { id: 1000, value: 'Inne', single: 0, parent: 3 },
    { id: 1.1, value: 'Zmiana Produktu', single: 0, parent: 3 },
    { id: 1.2, value: 'Zmiana Asortymentu', single: 0, parent: 3 },
    { id: 3.1, value: 'Maszyny', single: 0 ,parent:3 },
    { id: 3.2, value: 'Linia produkcyjna', single: 0 , parent:3 },
    { id: 3.3, value: 'Składniki', single: 0  , parent:3},
    { id: 5.1, value: 'Zmiana Surowda', single: 0  , parent:5},
    { id: 5.2, value: 'Brak Surowca', single: 0  , parent:5},
    { id: 5.3, value: 'Brak Badań', single: 0  , parent:5},
    { id: 6.1, value: 'Brak Mikrododatku', single: 0  , parent:6},
    { id: 6.2, value: 'SZFD', single: 0  , parent:6},
    { id: 6.3, value: 'TESTY', single: 0  , parent:6},
    { id: 7.1, value: 'Zjechanie Prowadnic', single: 0 , parent:7 },
    { id: 7.2, value: 'Regulacja Biegu', single: 0 , parent:7},
    { id: 7.3, value: 'Kornery', single: 0 , parent:7},
    { id: 7.4, value: 'Zmiana Rolki', single: 0, parent: 7},
    { id: 7.5, value: 'Urwana Łapa', single: 0, parent:7 },
    { id: 8.1, value: 'Awaria Spawna', single: 0, parent: 8},
    { id: 8.2, value: 'Awaria Stołu', single: 0 , parent:8},
    { id: 8.3, value: 'Awaria Buławy', single: 0 , parent:8},
    { id: 8.4, value: 'Awaria Wagi', single: 0, parent: 8},
    { id: 9.1, value: 'Zator', single: 0, parent: 9},
    { id: 9.2, value: 'Rozerwany Worek', single: 0, parent:9 },
    { id: 9.3, value: 'Ślizganie Worków', single: 0 , parent:9},
    { id: 10.1, value: 'Zerwana Etykieta', single: 0 , parent:10},
    { id: 10.2, value: 'Brak Etykiety', single: 0 , parent:10},
    { id: 10.3, value: 'Zmiana Rolki', single: 0, parent:10 },
    { id: 11.1, value: 'Głowica', single: 0, parent:11 },
    { id: 11.2, value: 'Tusz', single: 0 , parent:11},
    { id: 11.3, value: 'Solvent', single: 0, parent:11 },
    { id: 11.4, value: 'Przegląd', single: 0 , parent:11},
    { id: 12.1, value: 'Podajnik', single: 0 , parent:12},
    { id: 12.2, value: 'Folia Płaska', single: 0, parent:12 },
    { id: 12.3, value: 'Zrzucony Worek', single: 0, parent:12 },
    { id: 12.4, value: 'Czyszczenie', single: 0, parent:12 },
    { id: 13.1, value: 'Wymiana Foli', single: 0, parent: 13},
    { id: 13.2, value: 'Jonizator', single: 0, parent: 13},
    { id: 13.3, value: 'Czujnik Obecności', single: 0 , parent:13},
    { id: 14.1, value: 'Brak Surowca', single: 0 , parent:14},
    { id: 14.2, value: 'Brak MikroDodatku', single: 0 , parent:14},
    { id: 14.3, value: 'Brak Czyściwa', single: 0, parent: 14},
    { id: 15.1, value: 'Awaria Klap Otwarcia', single: 0, parent: 15},
    { id: 15.2, value: 'Awaria Klap Zamknięcia', single: 0, parent: 15},
    { id: 16.1, value: 'Awaria Ślimaka Wybierającego', single: 0 , parent:16},
    { id: 16.2, value: 'Awaria Kubełków', single: 0 , parent:16},
    { id: 16.3, value: 'Awaria Ślimaka', single: 0 , parent:16},
    { id: 16.4, value: 'Awaria Zasuwy', single: 0 , parent:16},
    { id: 17.1, value: 'Awaria Imak', single: 0 , parent:17},
    { id: 17.2, value: 'Awaria Zgrzewania', single: 0 , parent:17},
    { id: 17.3, value: 'Uszkodzony Worek ( sprzątanie )', single: 0 , parent:17},
    { id: 18.1, value: 'Brak Worków', single: 0, parent:18 },
    { id: 18.2, value: 'Brak Ciśnienia', single: 0 , parent:18},
    { id: 18.3, value: 'Regulacja ustawień', single: 0, parent: 18},
    { id: 19.1, value: 'Zaklinowane Worki', single: 0, parent: 19},
    { id: 19.2, value: 'Regulacja', single: 0, parent: 19},
    { id: 20.1, value: 'Głowica', single: 0 , parent:20},
    { id: 20.2, value: 'Tusz', single: 0, parent: 20},
    { id: 20.3, value: 'Solvent', single: 0, parent: 20},
    { id: 21.1, value: 'Pozycja Robota', single: 0 , parent:21},
    { id: 21.2, value: 'Zły schemat', single: 0, parent:21 },
    { id: 21.3, value: 'Rozerwany Worek (Łapa)', single: 0 , parent:21},
    { id: 22.1, value: 'Awaria Łapy', single: 0, parent: 22},
    { id: 22.2, value: 'Brak Palet', single: 0 , parent:22},
    { id: 22.3, value: 'Uszkodzona Paleta', single: 0 , parent:22},
    { id: 22.4, value: 'Bezpieczniki', single: 0, parent: 22},
    { id: 22.5, value: 'Bariera', single: 0, parent: 22},
    { id: 23.1, value: 'Zaklinowana Paleta', single: 0 , parent:23},
    { id: 23.2, value: 'Czujniki Pozycji', single: 0, parent:23 },
];

export interface TimeElement {
    startDate: Date;
    endDate: Date;
    category: number;
    path: string;

}
export const createTimeElement = ( startDate: Date, endDate: Date, categoryNumber: number, path: string ): TimeElement =>  {
   return  {
      startDate: startDate,
      endDate: endDate,
      category: categoryNumber,
      path: path,
    };
}


export interface TimeDifferenceCalculatorProps {
    filteredCategories: CategoryAwaria[];
    currentCategry: string;
}
