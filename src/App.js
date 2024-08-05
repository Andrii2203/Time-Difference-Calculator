import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const IntervalDates = { startDate: Date, endDate: Date, category: String };

const TimeDifferenceCalculator = () => {

  const [initialStartTime, setInitialStartTime] = useState(null);
  const [startTime1, setStartTime1] = useState(null);
  const [endTime1, setEndTime1] = useState(null);
  const [timeIsRuning, setTimeIsRuning] = useState(true);
  const [lastStartDate, setLastStartDate] = useState(null);
  const [intevalDates, setIntervalDates] = useState([]);
  const [item, setItem] = useState('1');
  const [showSetup, setShowSetup] = useState(true);
  
  const categoryItem = [
    { id: 1, value: 'Setup' },
    { id: 2, value: 'Praca' },
    { id: 3, value: 'Awaria' }, 
    { id: 4, value: 'Przerwa' },
  ];

  const mapCategoryToOptions = categoryItem.map(({ id, value }) => {
    if(showSetup && value !== "Setup") {
      return null;
    }
    if(!showSetup && value === "Setup") {
      return null;
    }
    return (
      <option key={id} value={id}>{value}</option>
    );
    setItem(id);
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
    console.log(mapCategoryToOptions);
  };

  const handleStop1 = () => {
    const now = new Date();
    setEndTime1(now);

    let id = {
      startDate: lastStartDate, 
      endDate: now, 
      category: item,
    };

    setTimeIsRuning(!timeIsRuning);

    intevalDates.push(id);
    setShowSetup(false);
  };


  
  const getItrenalDiff = (id) => {
    return ((id.endDate - id.startDate) / 1000).toFixed(1);
  };
  

  const handleFinish1 = () => {
    if(!initialStartTime || !endTime1) return;

    const firstStartTime = initialStartTime;
    console.log(`First Start Time: ${firstStartTime}`);

    const finalEndTime = endTime1;
    console.log(`Final End Time: ${finalEndTime}`);
   
    const totalTime = (finalEndTime - initialStartTime) / 1000;
    console.log(`Total Time: ${totalTime}`);
   
    console.log(intevalDates.length);

    let output = '';

    intevalDates.forEach(id => {
      console.log(getItrenalDiff(id));
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
  }

  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime1(null);
    setEndTime1(null);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setShowSetup(true);
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
