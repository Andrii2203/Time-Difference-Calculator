import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import {categoryItem,timeElement} from "./Interfaces"

const TimeDifferenceCalculator = () => {
  const [initialStartTime, setInitialStartTime] = useState(null);
  const [startTime1, setStartTime1] = useState(null);
  const [endTime1, setEndTime1] = useState(null);
  const [timeIsRuning, setTimeIsRuning] = useState(true);
  const [lastStartDate, setLastStartDate] = useState(null);
  const [intervalDates, setIntervalDates] = useState([]);
  const [item, setItem] = useState('1');


  const getActiveCattegory = () => {
    let ci = categoryItem
    let result = []
    if(intervalDates.length == 0) return  [categoryItem[0]]

    ci.forEach( ciit => {
          let addToList: Boolean = true
          intervalDates.forEach(it => {
            if (it.category == ciit.id && ciit.single == 1) {
              addToList = false
            }

          })
          if (addToList == true) {
            result.push(ciit)
          }
        }
    )
    return result
  }

  const mapCategoryToOptions = getActiveCattegory().map(({ id, value }) => {
      return (
          <option key={id} value={id}>{value}</option>
      );

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

    let id = timeElement(lastStartDate,now,item)

    setTimeIsRuning(!timeIsRuning);

    intervalDates.push(id);
    setItem('2');

  };

  const getIntervalDiff = (id) => {
    return ((id.endDate - id.startDate) / 1000).toFixed(1);
  };

  const handleFinish1 = () => {
    if (!initialStartTime || !endTime1) return;

    const firstStartTime = initialStartTime;
    console.log(`First Start Time: ${firstStartTime}`);

    const finalEndTime = endTime1;
    console.log(`Final End Time: ${finalEndTime}`);

    const totalTime = (finalEndTime - initialStartTime) / 1000;
    console.log(`Total Time: ${totalTime}`);

    console.log(intervalDates.length);

    let output = '';

    intervalDates.forEach(id => {
      console.log(getIntervalDiff(id));
      output += id.startDate.getTime().toLocaleString() + `: ${id.endDate.getTime().toLocaleString()}` + `: ${id.category}`+ '\n'
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
  };

  return (
    <div>
      <button onClick={handleStart1} disabled={!timeIsRuning}>Start</button>
      <button onClick={handleStop1} disabled={timeIsRuning}>Stop</button>
      <button onClick={handleFinish1} disabled={initialStartTime == null || !timeIsRuning}>Finish</button>

      <label>
        Choose category:
        <select name='category' value={item} onChange={(e) => setItem(e.target.value)}>
          {mapCategoryToOptions}
        </select>
      </label>

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
  );
};

export default TimeDifferenceCalculator;
