import React, { useState, useEffect } from 'react';
import ChooseYourL1L2 from './chooseHale';
import "./App.css"
import { TimeElement, TimeDifferenceCalculatorProps, Item } from "./Interfaces"



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
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [parent, setParent] = useState<Item[]>(filteredCategories);
  const [newParent, setNewParent] = useState<Item[]>([]);
  const [children, setChildren] = useState<Item[]>([]);
  const [newChildren, setNewChildren] = useState<Item[]>([]);
  const [newChildrenName, setNewChildrenName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [ifAwariaChoosen, setIfAwariaChoosen] = useState<boolean>(false);
  const [pathLine, setPathLine] = useState<string[]>([currentCategry]);

  const fullPath = (pathName : string, index: number) => {
    if(!ifAwariaChoosen) {
      setPathLine((prev) => [...prev, pathName]);
    } else {
      setPathLine(prev => {
        const updatedPathLine = [...prev];
          updatedPathLine[index] = pathName;
        return updatedPathLine;
      })
    }
  }
  const startingPath = () => {
    setPathLine((prev) => prev.slice(0, 2));
  }

  useEffect(() => {
    console.log("pathLine", pathLine);
  }, [pathLine])

  const handleCategorySelect = (itemObject: Item, path: string) => {
    setCurrentPath(path);
    setNewChildrenName(path)
    setName(itemObject.name);
    
    if(itemObject.children.length <= 0) return ;
    setChildren(itemObject.children);
    
    if(ifAwariaChoosen) {
      setNewChildren(itemObject.children); 
      fullPath(path, 3);
    }
  };
  const handleSubCategorySelect = (itemObject: Item, path: string) => {
    setNewChildrenName(path)
    fullPath(path, 4)
    
    if(itemObject.children.length <= 0) return ;
    setChildren(itemObject.children);
    
    if(ifAwariaChoosen) {
      setNewChildren(itemObject.children); 
    }
  };

  const ifYouChooseAwariaOption = () => {
      if (name === "Awaria") {
        setIfAwariaChoosen(true);
        setParent(children);
        setNewParent(parent);
        setNewChildren(parent);    
      }
    }


const handleStart1 = () => {
  if(!name) return;
  const now = new Date();
  if(!initialStartTime) {
    setInitialStartTime(now);
  }
  setLastStartDate(now);
  setStartTime1(now);
  setEndTime1(null);
  setTimeIsRuning(!timeIsRuning);
  ifYouChooseAwariaOption();
  setNewChildren([]);
  fullPath(name, 0);
};

  const handleStop1 = () => {
    const now = new Date();
    setEndTime1(now);
  
    if(lastStartDate && startTime1) {
      const id: TimeElement = {
        startDate: startTime1,
        endDate: now,
        path: currentPath,
      };

      setTimeIsRuning(!timeIsRuning);
      setIntervalDates([...intervalDates, id]);
      setIfAwariaChoosen(false);
      startingPath();

      if ( name === "Praca" ) {
        setCurrentPath('');
        setChildren([]);
      } else if ( name === "Przerwa" ) {
        setParent((prev) => prev.filter((item) => item.name !== "Przerwa"));
      } else if (name === "Awaria" && ifAwariaChoosen){
        setNewParent(children);
      } else if (ifAwariaChoosen) {
        setParent(newParent);
        console.log("pathLine", pathLine);
      } else {
        setParent(children);
        setChildren([]);
      }

      setName('');
    }
  }

  const handleFinish1 = () => {
    if (!initialStartTime || !endTime1) return;
    resetTimers();
    setIsFinished(true);
};
  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime1(null);
    setEndTime1(null);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setChildren([]);
    setParent(filteredCategories);
    setCurrentPath('');
    setIsFinished(false);
  };

  return (
    <div className='main-container'>
    {isFinished ? (
      <ChooseYourL1L2 />
    ) : (
      <>
      <div className='container-path'>
        {pathLine.join('/')}
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

          {parent.map(category => (
            <button
              key={category.name}
              className={currentPath === category.name ? "selected" : "not-selected"}
              onClick={() => handleCategorySelect(category, category.name)}
            >
              {category.name} {currentPath === category.name && "✓"}
            </button>
          ))}
        </div>

        <div className='second-container'>

          {ifAwariaChoosen && (
            newChildren.map(category => (
              <button
                key={category.name}
                className={newChildrenName === category.name ? "selected" : "not-selected"}
                onClick={() => handleSubCategorySelect(category, category.name)}
              >
                {category.name} {newChildrenName === category.name && "✓"}
              </button>))
          )}
        </div>

        <div className='sub-container'>
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