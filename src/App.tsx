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
  const [selectAwariaSubcategoryOption, setSelectAwariaSubcategoryOption] = useState<number | null>(null);
  const [path, setPath] = useState<string[]>([currentCategry]);
  
  useEffect(() => {
    console.log('Updated selectAwariaSubcategoryOption:', selectAwariaSubcategoryOption)
  }, [selectAwariaSubcategoryOption]);

  useEffect(() => {
    console.log('Updated item state:', item);
    console.log('Selected subcategories:', selectAwariaOption);
  }, [item, selectAwariaOption]);

  const handleCategorySelect = (id: number, value: string) => {
    setItem(id.toString());
    setSelectAwariaSubcategoryOption(null);
    setPath(prevPath => {
      const updatedPath = [...prevPath];
      if (updatedPath.length === 1) {
        updatedPath.push(value);
      } else if (updatedPath.length === 2) {
        updatedPath.push(value);
      } else if (updatedPath.length === 3) {
        updatedPath[2] = value;
      }   
      return updatedPath;
    });
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
      output += id.startDate.toLocaleString() + `: ${id.endDate.toLocaleString()}` + `: ${id.category}`;
      
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
  const handleMapCatToOption = (id: number) => {
    setItem(id.toString());
  }

  const mapCategoryToOptions = getActiveCattegory().map(({ id, value }) => {
    return (  
      <button
        key={id}
        className={item === id.toString() ? "selected" : "not-selected"}
        // onClick={() => handleMapCatToOption(id)}
        onClick={() => handleCategorySelect(id, value)}
      >
        {value} {item === id.toString() && '✓'}
      </button>
    )
  });

  const handleSubCategorySelect = (subCategoryId : number) => {
    setSelectAwariaSubcategoryOption(subCategoryId)
  };
  
  const awariaOption = () => {

    if (item === '3') {
      return (
        <div>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              className={selectAwariaSubcategoryOption === cat.id ? "selected" : "not-selected"}
              onClick={() => handleSubCategorySelect(cat.id)}
            >
              {cat.value} {selectAwariaSubcategoryOption === cat.id && '✓'}
            </button>
          ))}
        </div>
      );
    } 
    return null;
  };

  const handleOptionChange = (selectedId: number) => {
    const selectedSubcategory = categoryAwaria.find(cat => cat.id === selectedId);
  
    if (selectedSubcategory) {
      console.log('Selected subcategory parent ID:', selectedSubcategory.parent);
    }
  
    setSelectAwariaOption(prev => {
      if (prev.includes(selectedId)) {
        return prev.filter(id => id !== selectedId);
      } else {
        return [...prev, selectedId];
      }
    });
  };
  

  const renderAwariaOption = () => {
    const subCategories = categoryAwaria.filter(cat => 
      cat.parent === selectAwariaSubcategoryOption && item === '3'
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

  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime1(null);
    setEndTime1(null);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setItem('1');
    setSelectAwariaOption([]);
    setSelectAwariaSubcategoryOption(null);
    setPath([currentCategry]);
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
          {/* <h4 className='item-container-text'>Choose category:</h4> */}
          {mapCategoryToOptions}
        </div>

        <div className='second-container'>
          {/* <h4 className='item-container-text'>Choose category Awaria:</h4> */}
          {awariaOption()}
        </div>

        <div className='sub-container'>
          {/* <h4 className='item-container-text'>Choose Subcategory:</h4> */}
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