import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { createTimeElement, CategoryAwaria, TimeElement, categoryAwaria, TimeDifferenceCalculatorProps } from "./Interfaces";
import "./App.css"

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
  const [selectAwariaOption, setSelectAwariaOption] = useState<number[]>([]);
  
  const [path, setPath] = useState<string[]>([currentCategry]);
  
  console.log('item', item)

  const getActiveCattegory = (): CategoryAwaria[] => {
    const result: CategoryAwaria[] = [];
    if(intervalDates.length === 0) return [filteredCategories[0]];

    filteredCategories.forEach(ciit => {
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

  const mapCategoryToOptions = getActiveCattegory().map(({ id, value }) => {
        return (  
          <button
            key={id}
            className={item === id.toString() ? "selected" : "not-selected"}
            // onClick={() => setItem(id.toString())}
            onClick={() => handleCategorySelect(id, value)}
          >
            {value} {item === id.toString() && '✓'}
          </button>
        )
  });

  const handleCategorySelect = (id: number, value: string) => {
    setItem(id.toString());

    setPath((prevPath) => {
      const updatedPath = [...prevPath];
      if(updatedPath.length === 1) {
        updatedPath.push(value);
      }else {
        updatedPath[1] = value;
      }
      return updatedPath;
    });
  };
  const handleOptionChange = (selectedId: number) => {
    const selectedSubcategory = categoryAwaria.find(cat => cat.id === selectedId);
  
    if (selectedSubcategory) {
      setSelectAwariaOption(prev => {
        const updatedOptions = prev.includes(selectedId)
          ? prev.filter(id => id !== selectedId)
          : [...prev, selectedId];

        setPath((prevPath) => {
          const updatedPath = [...prevPath];

          const subCategories = updatedOptions.map(subCatId => {
            const subCategory = categoryAwaria.find(cat => cat.id === subCatId);
            return subCategory ? subCategory.value : '';
          });

          if (updatedPath.length === 2) {
            updatedPath.push(subCategories.join(', '));  // Додаємо підкатегорії
          } else {
            updatedPath[2] = subCategories.join(', ');  // Оновлюємо підкатегорії
          }

          return updatedPath;
        });

        return updatedOptions;
      });
    }
  };

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

  const handleFinish1 = () => {
    if (!initialStartTime || !endTime1) return;

    const firstStartTime = initialStartTime;
    const finalEndTime = endTime1;
    const totalTime = (finalEndTime.getTime() - firstStartTime.getTime()) / 1000;

    console.log(intervalDates.length);

    let output = '';

    intervalDates.forEach(id => {
      console.log(getIntervalDiff(id));
      output += id.startDate.getTime().toLocaleString() + `: ${id.endDate.getTime().toLocaleString()}` + `: ${id.category}`;
      
      const hasSubcategories = selectAwariaOption.some(subCat => Math.floor(subCat) === id.category);

      if(hasSubcategories) {
        const selectedSubcategories = selectAwariaOption.filter(subCat => Math.floor(subCat) === id.category);
        output += `: ${selectedSubcategories.join(', ')}`;
      }

      output += '\n';
    })

    const textToSave = 
      `Initial Start Time: ${initialStartTime.toLocaleString()}
      Final End Time: ${finalEndTime.toLocaleString()}
      Total Time: ${totalTime.toFixed(2)} sec
    `;

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'time-difference.txt');

    resetTimers();
  };

  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime1(null);
    setEndTime1(null);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setItem('1');
    setSelectAwariaOption([]);
    setPath([currentCategry]);
  };

//   const handleOptionChange = (selectedId: number) => {
//     const selectedSubcategory = categoryAwaria.find(cat => cat.id === selectedId);
  
//     if (selectedSubcategory) {
//       console.log('Selected subcategory parent ID:', selectedSubcategory.parent);
//     }
  
//     setSelectAwariaOption(prev => {
//       if (prev.includes(selectedId)) {
//         return prev.filter(id => id !== selectedId);
//       } else {
//         return [...prev, selectedId];
//       }
//     });
// };

  useEffect(() => {
    console.log("Updated selectAwariaOption:", selectAwariaOption);
  }, [selectAwariaOption]);
  
  const renderAwariaOption = () => {
    const subCategories = categoryAwaria.filter(cat => 
      cat.parent === parseInt(item, 10)
    );
  
    return subCategories.map(subcat => (
      <div key={subcat.id}>
          <button 
            className={selectAwariaOption.includes(subcat.id) ? "selected" : "not-selected"}
            onClick={() => handleOptionChange(subcat.id)}
          >
          {subcat.value} {selectAwariaOption.includes(subcat.id) && '✓'}
        </button>
      </div>
    ));
  };
  
  return (
    <div className='main-container'>
      <p>{path.join(' / ')}</p>
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
      </div>

      <div className='category-container'>

        <div className='item-container'>
          <h4 className='item-container-text'>Choose category:</h4>
          {mapCategoryToOptions}
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