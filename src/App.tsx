import React, { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import ChooseYourL1L2 from './chooseHale';
import axios from 'axios';
import { createTimeElement, CategoryAwaria, TimeElement, categoryAwaria, TimeDifferenceCalculatorProps } from "./Interfaces";
import "./App.css"
// import { response } from 'express';


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
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const fullPath = (id: string) => {
    console.log('fullPath', id);
    let searchId = id;
    let pathComplited = false;
    let newFullPathComplited = '';
  
    while (pathComplited === false) {
      pathComplited = true;
      let awaria = categoryAwaria.find(cat => cat.id.toString() === searchId);
      console.log(" awaria ", awaria);
      if (awaria !== undefined) {
        newFullPathComplited = awaria.value + newFullPathComplited;
        if (awaria.parent.toString() !== "-1") {
          pathComplited = false;
          searchId = awaria.parent.toString();
          newFullPathComplited = " / " + newFullPathComplited;
        } else {
          pathComplited = true;
          newFullPathComplited = currentCategry + ' / ' + newFullPathComplited;
        }
      }
    }
    console.log('newFullPathComplited', newFullPathComplited);
    setPath(newFullPathComplited);
  };


  const handleCategorySelect = useCallback((id: number, value: string, isSubcategory: boolean = false, currentPath : string) => {
    console.log('handleCategorySelect:');
    setItem(id.toString());

    if (id === 3 && !isSubcategory) {
      setShowMainCategories(false);
    }
    
    fullPath(id.toString())
    console.log('Updated path:', currentPath);

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
      const id = createTimeElement(lastStartDate, now, parseInt(item), path);
      setTimeIsRuning(!timeIsRuning);
      setIntervalDates([...intervalDates, id]);
      setItem('');
      setShowMainCategories(true);
    }
  }

  const handleFinish1 = () => {
    if (!initialStartTime || !endTime1) return;

    const firstStartTime = initialStartTime;
    const finalEndTime = endTime1;
    const totalTime = (finalEndTime.getTime() - firstStartTime.getTime()) / 1000;

    const dataToSend = {
      initialStartTime: initialStartTime.toLocaleString(),
      finalEndTime: finalEndTime.toLocaleString(),
      totalTime: totalTime.toFixed(2),
      intervals: intervalDates.map(id => {
        console.log('Обробляється інтервал з id:', id.category);
        const pathValue = id.path;
        console.log('Значення pathValue:', pathValue);
        return {
          startDate: id.startDate.toLocaleString(),
          endtDate: id.endDate.toLocaleString(),
          category: id.category,
          path: pathValue,
        }
      })
    };

    axios.post('http://localhost:5000/save-time-data', dataToSend)
      .then(response => {
        console.log("Odpowiedż z serwera:", response.data);
      
        return   axios.get('http://localhost:5000/get-time-data');
      })
      .then(response => {
        let fileData = '';

        intervalDates.forEach(id => {
          const pathValue = id.path;
          fileData += id.startDate.toLocaleString() + `: ${id.endDate.toLocaleString()}` + `: ${id.category}` + `: ${pathValue}`;
          fileData += '\n';
        });

        const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'time-difference.txt');
      })
      .catch(error => {
        console.error('Błąd podczas pobierania pliku:', error);
      });
    resetTimers();
  
    setIsFinished(true);

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
              <div className='container-category-option'>
                <button
                    key={id}
                    className={item === id.toString() ? "selected" : "not-selected"}
                    onClick={() => handleCategorySelect(id, value, false, path)}
                >
                    {value} {item === id.toString() && '✓'}
                </button>
              </div>
            );
        });
    }
    return null;
};

  const handleSubCategorySelect = (id : number, value : string, currentPath : string) => {
    console.log('handleSubCategorySelect:');
    setSelectAwariaSubcategoryOption(id);

    fullPath(id.toString())

    console.log('Updated path:', currentPath);
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
            <div className='container-wstecz-button'>
              <button 
                onClick={toggleCategoriesVisibility}
                className='wstecz-button'  
              >
                ←
              </button>
            </div>
                {filteredCategories.map((cat) => (
                  <div className='container-awaria-option'>                
                    <button
                        key={cat.id}
                        className={selectAwariaSubcategoryOption === cat.id ? "selected" : "not-selected"}
                        onClick={() => handleSubCategorySelect(cat.id, cat.value, path)}
                    >
                        {cat.value} 
                        {selectAwariaSubcategoryOption === cat.id && '✓'}
                    </button>
                  </div>
                ))}
          </div>
      );
  }
  return null;
  };

  const handleOptionChange = useCallback((id: number, value : string, currentPath : string) => {
    console.log('handleOptionChange:');
    const selectedSubcategory = categoryAwaria.find(cat => cat.id === id);
  
    if (selectedSubcategory) {
      console.log('Selected subcategory parent ID:', selectedSubcategory.parent);
    }
  
    setSelectAwariaOption(id);

    fullPath(id.toString())
    console.log('Updated path:', currentPath);

  }, []);
  

  const renderAwariaOption = useCallback(() => {
    const subCategories = categoryAwaria.filter(cat => 
      cat.parent === selectAwariaSubcategoryOption && item === '3'
    );

    return subCategories.map(subcat => (
      <div 
        key={subcat.id}
        className='container-awaria-subcategory'
      >
        <button 
          className={selectAwariaOption === subcat.id ? "selected" : "not-selected"}
          onClick={() => handleOptionChange(subcat.id, subcat.value, path)}
        >
          {subcat.value} 
          {selectAwariaOption === subcat.id && '✓'}
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
    setItem('');
    setSelectAwariaOption(null);
    setSelectAwariaSubcategoryOption(null);
    setPath(currentCategry);
    // setIsFinished(false);
  };

  return (
    <div className='main-container'>
    {isFinished ? (
      <ChooseYourL1L2 />
    ) : (
      <>
      <div className='container-path'>
        <p>{path}</p>
      </div>
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
      </>
  )}
    </div>
    
)};


export default TimeDifferenceCalculator;