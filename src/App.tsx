import React, { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { createTimeElement, CategoryAwaria, TimeElement, categoryAwaria, TimeDifferenceCalculatorProps } from "./Interfaces";
import "./App.css"
import { response } from 'express';

const TimeDifferenceCalculator: React.FC<TimeDifferenceCalculatorProps> = ({ 
    filteredCategories, 
    currentCategry,
 }) => {
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null);
  const [startTime1, setStartTime1] = useState<Date | null>(null);
  const [endTime1, setEndTime1] = useState<Date | null>(null);
  const [timeIsRuning, setTimeIsRuning] = useState<boolean>(true);
  const [lastStartDate, setLastStartDate] = useState<Date | null>(null);
  const [intervalDates, setIntervalDates] = useState<TimeElement[]>([]);
  const [item, setItem] = useState<string>('0');
  const [selectAwariaOption, setSelectAwariaOption] = useState<number | null>(null);
  const [selectAwariaSubcategoryOption, setSelectAwariaSubcategoryOption] = useState<number | null>(null);
  const [path, setPath] = useState<string>('');
  const [showMainCategories, setShowMainCategories] = useState<boolean>(true);
  
  // useEffect(() => {
  //   const mainCategories = categoryAwaria.filter(
  //     (category) =>
  //       Number.isInteger(category.id) &&
  //       category.parent === -1 &&
  //       category.single !== 0
  //   );

  //   if(mainCategories.length > 0) {
  //     setPath(prev => [...prev, mainCategories[0].value]);
  //   }
  // }, [currentCategry]);

  // useEffect(() => {
  //   console.log('Updated showMainCategories:', showMainCategories);
  //   console.log('Updated path:', path);
    
  // }, [showMainCategories, path]);
  
  const handleCategorySelect = useCallback((id: number, value: string, isSubcategory: boolean = false, currentPath : string) => {
    console.log('handleCategorySelect:');
    setItem(id.toString());

    let updatedPath = currentPath + " / " + value;

    if (id === 3 && !isSubcategory) {
      setShowMainCategories(false);
    }
    
    setPath(updatedPath);
    console.log('Updated path:', currentPath);
    console.log('Updated path:', updatedPath);
    // if (selectAwariaOption) {
    //   const awariaOption = categoryAwaria.find(cat => cat.id === selectAwariaOption)?.value;
    //   if (awariaOption && !updatedPath.includes(awariaOption)) {
    //     updatedPath += awariaOption.toString();
    //   }
    // }

    // if (isSubcategory && selectAwariaSubcategoryOption) {
    //   const awariaSubcategory = categoryAwaria.find(cat => cat.id === selectAwariaSubcategoryOption)?.value;
    //   if (awariaSubcategory && !updatedPath.includes(awariaSubcategory)) {
    //     updatedPath += awariaSubcategory.toString();
    //   }
    // }
}, [selectAwariaOption, selectAwariaSubcategoryOption]);

  const handleStart1 = () => {
    const now = new Date();
    if(!initialStartTime) {
      setInitialStartTime(now);
    }
    setLastStartDate(now);
    setStartTime1(now);
    setEndTime1(null);
    setTimeIsRuning(!timeIsRuning);
  };

  const handleStop1 = () => {
    const now = new Date();
    setEndTime1(now);

    if(lastStartDate) {
      const id = createTimeElement(lastStartDate, now, parseInt(item));
      setTimeIsRuning(!timeIsRuning);
      setIntervalDates([...intervalDates, id]);
      setItem('');
    }
  }

  const getIntervalDiff = (id: TimeElement) => {
    return ((id.endDate.getTime() - id.startDate.getTime()) / 1000).toFixed(1);
  };

  // const handleFinish1 = () => {
  //   if (!initialStartTime || !endTime1) return;

  //   const firstStartTime = initialStartTime;
  //   const finalEndTime = endTime1;
  //   const totalTime = (finalEndTime.getTime() - firstStartTime.getTime()) / 1000;

  //   console.log(intervalDates.length);

  //   let output = '';

  //   intervalDates.forEach(id => {
  //     console.log(getIntervalDiff(id));
  //     output += id.startDate.toLocaleString() + `: ${id.endDate.toLocaleString()}` + `: ${id.category}`;
      
  //     if(Array.isArray(selectAwariaOption)) {
  //       const hasSubcategories = selectAwariaOption.some((subCat : number) => Math.floor(subCat) === id.category);
  //       if(hasSubcategories) {
  //         const selectedSubcategories = selectAwariaOption.filter((subCat : number) => Math.floor(subCat) === id.category);
  //         output += `: ${selectedSubcategories.join(', ')}`;
  //       }
  //     }

  //     output += '\n';
  //   })

  //   const textToSave = 
  //     `Initial Start Time: ${initialStartTime.toLocaleString()}
  //     Final End Time: ${finalEndTime.toLocaleString()}
  //     Total Time: ${totalTime.toFixed(2)} sec
  //   `;

  //   const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
  //   saveAs(blob, 'time-difference.txt');

  //   resetTimers();
  // };
  const handleFinish1 = () => {
    if (!initialStartTime || !endTime1) return;

    const firstStartTime = initialStartTime;
    const finalEndTime = endTime1;
    const totalTime = (finalEndTime.getTime() - firstStartTime.getTime()) / 1000;

    const dataToSend = {
      initialStartTime: initialStartTime.toLocaleString(),
      finalEndTime: finalEndTime.toLocaleString(),
      totalTime: totalTime.toFixed(2),
      intervals: intervalDates.map(id => ({
        startDate: id.startDate.toLocaleString(),
        endtDate: id.endDate.toLocaleString(),
        category: id.category
      }))
    };

    axios.post('http://localhost:5000/save-time-data', dataToSend)
      .then(response => {
        console.log("Odpowiedż z serwera:", response.data);
      })
      .catch(error => {
        console.error("Bląd podczas wysyłania danych na serwer:", error);
      });

    resetTimers();
  };

//   const downloadFile = () => {
//     axios.get('http://localhost:5000/get-time-data')
//       .then(response => {
//         let fileData = response.data;
//         // let fileData = '';
//         console.log('fileData:', fileData);

//             intervalDates.forEach(id => {
              
//               fileData += id.startDate.toLocaleString() + `: ${id.endDate.toLocaleString()}` + `: ${id.category}`;
              
//               if(Array.isArray(selectAwariaOption)) {
//                 const hasSubcategories = selectAwariaOption.some((subCat : number) => Math.floor(subCat) === id.category);
//                 if(hasSubcategories) {
//                   const selectedSubcategories = selectAwariaOption.filter((subCat : number) => Math.floor(subCat) === id.category);
//                   fileData += `: ${selectedSubcategories.join(', ')}`;
//                 }
//               }

//               fileData += '\n';
//             })

//         const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
//         saveAs(blob, 'time-difference.txt');

//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'time-difference.txt');
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     })
//     .catch(error => {
//         console.error('Błąd podczas pobierania pliku:', error);
//     });
// };

const downloadFile = () => {
  axios.get('http://localhost:5000/get-time-data')
    .then(response => {
      let fileData = response.data;

      intervalDates.forEach(id => {
        fileData += id.startDate.toLocaleString() + `: ${id.endDate.toLocaleString()}` + `: ${id.category}`;

        if (Array.isArray(selectAwariaOption)) {
          const hasSubcategories = selectAwariaOption.some((subCat : number) => Math.floor(subCat) === id.category);
          if (hasSubcategories) {
            const selectedSubcategories = selectAwariaOption.filter((subCat : number) => Math.floor(subCat) === id.category);
            fileData += `: ${selectedSubcategories.join(', ')}`;
          }
        }

        fileData += '\n';
      });

      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'time-difference.txt');
    })
    .catch(error => {
      console.error('Błąd podczas pobierania pliku:', error);
    });
};

  const getActiveCattegory = (): CategoryAwaria[] => {
    const result: CategoryAwaria[] = [];

    const mainCategoies = categoryAwaria.filter(
      (category) =>
        Number.isInteger(category.id) &&
        category.parent === -1 &&
        category.single !== 0
    );

    if(intervalDates.length === 0) {
      return [mainCategoies[0]]
    } 

    mainCategoies.forEach(ciit => {
      let addToList = true;
      intervalDates.forEach(it => {
        if(it.category === ciit.id && ciit.single === 1) {
          addToList = false;
        }
      });
      if(addToList) {
        result.push(ciit);
      }
    });
    return result;
  }

  const mapCategoryToOptions = () => {
    if (showMainCategories) {
        return getActiveCattegory().map(({ id, value }) => {
            return (  
                <button
                    key={id}
                    className={item === id.toString() ? "selected" : "not-selected"}
                    onClick={() => handleCategorySelect(id, value, false, path)}
                >
                    {value} {item === id.toString() && '✓'}
                </button>
            );
        });
    }
    return null;
};

  const handleSubCategorySelect = (subCategoryId : number, value : string, currentPath : string) => {
    console.log('handleSubCategorySelect:');
    setSelectAwariaSubcategoryOption(subCategoryId);
    let updatedPath = currentPath + " / " + value;
    setPath(updatedPath);
    console.log('Updated path:', currentPath);
    console.log('Updated path:', updatedPath);

  };

  const toggleCategoriesVisibility = () => {
    setShowMainCategories(prev => !prev);

    if(!showMainCategories) {
      setSelectAwariaSubcategoryOption(null);
      setItem("0");
    }
  }

  const awariaOption = () => {

    if (item === "3") {
      return (
          <div>
            <div>
              <button 
                onClick={toggleCategoriesVisibility}
                className='wstecz-button'  
              >
                ←
              </button>
            </div>
            <div>
                {filteredCategories.map((cat) => (
                    <button
                        key={cat.id}
                        className={selectAwariaSubcategoryOption === cat.id ? "selected" : "not-selected"}
                        onClick={() => handleSubCategorySelect(cat.id, cat.value, path)}
                    >
                        {cat.value} {selectAwariaSubcategoryOption === cat.id && '✓'}
                    </button>
                ))}
            </div>
          </div>
      );
  }
  return null;
  };

  const handleOptionChange = useCallback((selectedId: number, value : string, currentPath : string) => {
    console.log('handleOptionChange:');
    const selectedSubcategory = categoryAwaria.find(cat => cat.id === selectedId);
  
    if (selectedSubcategory) {
      console.log('Selected subcategory parent ID:', selectedSubcategory.parent);
    }
  
    setSelectAwariaOption(selectedId);

    let updatedPath = currentPath + " / " + value;
    setPath(updatedPath);
    console.log('Updated path:', currentPath);
    console.log('Updated path:', updatedPath);

  }, []);
  

  const renderAwariaOption = useCallback(() => {
    const subCategories = categoryAwaria.filter(cat => 
      cat.parent === selectAwariaSubcategoryOption && item === '3'
    );

    return subCategories.map(subcat => (
      <div key={subcat.id}>
        <button 
          className={selectAwariaOption === subcat.id ? "selected" : "not-selected"}
          onClick={() => handleOptionChange(subcat.id, subcat.value, path)}
        >
          {subcat.value} {selectAwariaOption === subcat.id && '✓'}
        </button>
      </div>
    ));
  }, [selectAwariaSubcategoryOption, item, selectAwariaOption, handleOptionChange]);

  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime1(null);
    setEndTime1(null);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setItem('1');
    setSelectAwariaOption(null);
    setSelectAwariaSubcategoryOption(null);
    // setPath(currentCategry);
  };

  return (
    <div className='main-container'>
      <p>{path}</p>
      <div className='btn-container'>
        <button
            onClick={handleStart1}
            disabled={!timeIsRuning}
            className={`btn-start ${!timeIsRuning ? "btn-disabled" : ""}`}
        >
          Start
        </button>
        <button
            onClick={handleStop1}
            disabled={timeIsRuning}
            className={`btn-stop ${timeIsRuning ? "btn-disabled" : ""}`}
        >
          Stop
        </button>
        <button
            onClick={handleFinish1}
            disabled={initialStartTime == null || !timeIsRuning}
            className={`btn-finish ${!timeIsRuning ? "btn-disabled" : ""}`}
        >
          Finish
        </button>
        <button onClick={downloadFile}>Pobierz plik</button>
      </div>

      <div className='category-container'>

        <div className='item-container'>
          {mapCategoryToOptions()}
        </div>

        <div className='second-container'>
          {awariaOption()}
        </div>

        <div className='sub-container'>
          {renderAwariaOption()}
        </div>
      </div>

      <div className='container-with-time'>
        {startTime1 && (
            <div>
              <p>Start: {startTime1.toLocaleString()}</p>
            </div>
        )}

        {endTime1 && (
            <div>
              <p>Stop: {endTime1.toLocaleString()}</p>
            </div>
        )}

        {initialStartTime && (
            <div>
              <p>Initial Start Time: {initialStartTime.toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className='current-categry-text'>
        <p>
          Current: {currentCategry}
        </p>
      </div>
    </div>
  );
};

export default TimeDifferenceCalculator;