import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { createTimeElement, CategoryAwaria, TimeElement, categoryAwaria } from "./Interfaces";
import "./App.css"

const TimeDifferenceCalculator: React.FC = () => {
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null);
  const [startTime1, setStartTime1] = useState<Date | null>(null);
  const [endTime1, setEndTime1] = useState<Date | null>(null);
  const [timeIsRuning, setTimeIsRuning] = useState<boolean>(true);
  const [lastStartDate, setLastStartDate] = useState<Date | null>(null);
  const [intervalDates, setIntervalDates] = useState<TimeElement[]>([]);
  const [item, setItem] = useState<string>('1');
  const [selectAwariaOption, setSelectAwariaOption] = useState<number[]>([]);

  const getActiveCattegory = (): CategoryAwaria[] => {
    const result: CategoryAwaria[] = [];
    if(intervalDates.length === 0) return [categoryAwaria[0]];

    categoryAwaria.forEach(ciit => {
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
          <label key={id}>
            <input 
              type='radio'
              name='category'
              value={id}
              checked={item === id.toString()}
              onChange={() => setItem(id.toString())}
            />
            {value}
          </label>
        )
  });


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
      setItem('2');
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
      
      if(id.category === 3 && selectAwariaOption.length > 0) {
        output += `: ${selectAwariaOption.join(', ')}`;
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
  };

  const handleAwariaOptionChange = (id: number) => {
    setSelectAwariaOption(prev =>
      prev.includes(id)
        ? prev.filter(optId => optId !== id)
        : [...prev, id]
    );
  };

  const renderAwariaOption = () => {

    const selectedCategoryId = parseInt(item);

    const selectCategoryItem = categoryAwaria.find(
      (categoty) => categoty.id === selectedCategoryId
    );

    if(!selectCategoryItem) return null;

    const filteredAwariaOption = categoryAwaria.filter(
      (awaria) => awaria.parent === selectCategoryItem.id
    );

    return (
      <div>
        <h4>Awaria Options for {selectCategoryItem.value}:</h4>
        {filteredAwariaOption.map(({ id, value }) => (
          <div key={id}>
            <label>
              <input
                type="checkbox"
                value={id}
                checked={selectAwariaOption.includes(id)}
                onChange={() => handleAwariaOptionChange(id)}
              />
              {value}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='main-container'>
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
          <h4>Choose category:</h4>
          {mapCategoryToOptions}
        </div>

        {renderAwariaOption()}
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
    </div>
  );
};

export default TimeDifferenceCalculator;