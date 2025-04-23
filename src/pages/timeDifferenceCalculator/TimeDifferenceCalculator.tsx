import React, { useEffect, useMemo, useState } from 'react';
import './timeDifferenceCalculator.css'
import { changeTAndDeleteMilisec } from '../../utils/changeTAndDeleteMilisec/changeTAndDeleteMilisec';
import data from '../../data.json';
import CurrentCategry from '../../components/currentCategory/CurrentCategory';
import { TimeElement, Item } from '../../interfaces/Interfaces';
import Breadcrumbs from '../../components/breadcrumb/Breadcrumb';
import { fetchWithAuth } from '../../utils/auth/auth';
import { findLeadNodes } from '../../utils/findLeadNodes/leafNodes';
import { RenderLeaf } from "../../components/renderLeaf/RenderLeaf"
import { filteredItems } from '../../utils/helper/filteredItems';
import { DeleteLastElementButton } from '../../components/backBtn/DeleteLastElementButton';
import { modifyItem } from '../../utils/modifyItem/modifyItem';
import { getPath } from '../../utils/getPath/getPath';

const TimeDifferenceCalculator: React.FC = () => {
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [finishTime, setFinishTime] = useState<Date | null>(null);
  const [timeIsRuning, setTimeIsRuning] = useState<boolean>(true);
  const [buttonsLoad, setButtonsLoad] = useState<boolean>(false);
  const [lastStartDate, setLastStartDate] = useState<Date | null>(null);
  const [intervalDates, setIntervalDates] = useState<TimeElement[]>([]);
  const [dataTree, setDataTree] = useState<Item[]>(data);
  const [parents, setParents] = useState<Item[]>([]);
  const [singleItem, setSingleItem] = useState<Item | null>(null);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  useEffect(() => {
    const update = modifyItem(dataTree, 'addMeta', "Prygotowanie", { exclusive: true });
    setDataTree(update);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval is running...");

      fetchWithAuth("http://localhost:5000/ping", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"},
        }).then(res => {
          if(!res.ok) {
            console.warn("Failed to refresh token, status:", res.status);
          } else {
            console.log("Token refreshed successfully.");
          }
        }).catch(err => {
          console.error("Error during token refresh:", err);
        });
    }, 24 * 60 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);
  
  const leaf = useMemo(() => findLeadNodes(dataTree), []);
  const isSelectedLeaf = () => {
    if(singleItem?.name === "Prygotowanie") return true;
    return singleItem ? leaf.some(l => l.name === singleItem.name) : false;
  }

  useEffect(() => {
    console.log('parents', parents);
    console.log('data', dataTree);
    // console.log('singleItem', singleItem);
    console.log("finish time,", finishTime);
    if(singleItem?.name === "Awaria") {
      setDisableBtn(false);
    }
  }, [parents, dataTree, singleItem, finishTime]);

  const handleSelectItem = (item: Item) => {
    if(item.name === "L1" || item.name === "L2") {
      setSingleItem(null);
    } else {
      setSingleItem(item);
    }

    if(disableBtn) {
      return;
    }
    console.log("item", item);
    if(item.name === "Prygotowanie") {
      handleStart1();
      return;
    }
    if(item.name === "Przerwa") {
      return;
    }
    if(item.name === "Awaria") {
      handleStart1();
    }

    if(item.children.length === 0){
      return null;
    }

    setParents((prev) => {
      if(prev.includes(item)) return prev;
      return [...prev, item];
    })
    
    if(parents.length === 0) {
        setButtonsLoad(true);
    }
  };
  
  const handleStart1 = () => {
    if(singleItem?.name.length === 0) {
      return;
    }
    setDisableBtn(true);
    const now = new Date();
    if(!initialStartTime) {
      setInitialStartTime(now);
    }
    if(singleItem?.name === "Awaria") {
      setDisableBtn(false);
    }
    setLastStartDate(now);
    setStartTime(now);
    setEndTime(null);
    setTimeIsRuning(!timeIsRuning);
  };

  const handleStop1 = () => {
    const now = new Date();
    setEndTime(now);

    stopRunningTime(now);
    handleRemoveSpacialItems();

    setSingleItem(null);
    setDisableBtn(false);

    if(parents && parents[0]) {
      setParents([parents[0]]);
    }
  }

  const stopRunningTime = (now: Date) => {
    if(lastStartDate && startTime) {
      const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000)
      const id: TimeElement = {
        startDate: startTime,
        endDate: now,
        durationInSeconds: duration,
        path: getPath(singleItem, parents),
      };
      setTimeIsRuning(!timeIsRuning);
      setIntervalDates([...intervalDates, id]);
    }
  }

  const handleRemoveSpacialItems = () => {
    if(singleItem?.name === "Prygotowanie" || singleItem?.name === "Przerwa") {
      const update = modifyItem(dataTree, "removeItem", singleItem.name);

      setDataTree((prev) => {
        const newTree = update;
        setParents((prev) => {
          return prev.map((p) => {
            const upI = newTree.find(i => i.name === p.name);
            return upI ? upI : p;
          });
        });
        return newTree;
      })
    }
  }

  const handleFinish = async () => {
    if (!initialStartTime || !endTime) return;
    
    const now = new Date();
    if(!finishTime) {
      setFinishTime(now);
    }

    const finishT = finishTime ?? now;
    const timeFromStartTillFinishWithDifferentOptions = Math.floor((finishT.getTime() - initialStartTime.getTime()) / 1000);
    const totalTime = Math.floor((endTime.getTime() - initialStartTime.getTime()) / 1000);
    
    const sumOfIntervals = intervalDates.reduce((acc, curr) => acc + curr.durationInSeconds, 0);
    const pracaTime = timeFromStartTillFinishWithDifferentOptions - sumOfIntervals;

    const awariaDurationFromIntervals = intervalDates.reduce((acc, curr) => {
      const isAwaria = curr.path.split(" / ").includes("Awaria");
      if (!isAwaria) return acc;
      const duration = (curr.endDate.getTime() - curr.startDate.getTime()) / 1000;
      return acc + duration;
    }, 0);

    const dataToSend = {
      FirstStart: changeTAndDeleteMilisec(initialStartTime),
      LastStop: changeTAndDeleteMilisec(endTime),
      TimeFromLastStopMinusFirstStart: totalTime.toFixed(0),
      AwariaTime: awariaDurationFromIntervals.toFixed(0),
      FinishTime: changeTAndDeleteMilisec(finishT),
      FinishMinusFirstStart: timeFromStartTillFinishWithDifferentOptions.toFixed(0),
      PracaTimeIsFinishMinusFirstStartMinusIntervalsTime: pracaTime.toFixed(0),
      IntervalsTime: sumOfIntervals.toFixed(0),
      Intervals: intervalDates.map(id => {
        return {
          startDate: changeTAndDeleteMilisec(id.startDate),
          endDate: changeTAndDeleteMilisec(id.endDate),
          path: id.path,
        }
      })
    }

    try {
      const res = await fetchWithAuth("http://localhost:5000/save-time-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
        credentials: "include",
      });
      if(!res.ok) {
        throw new Error("Failed to save data");
      }
      const message = await res.text();
      resetTimers();
      alert(message);
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while saving data");
    }
  };

  const resetTimers = () => {
    setInitialStartTime(null);
    setStartTime(null);
    setEndTime(null);
    setFinishTime(null);
    setTimeIsRuning(true);
    setButtonsLoad(false);
    setLastStartDate(null);
    setIntervalDates([]);
    setDataTree(data);
    setParents([]);
    setSingleItem(null);
    setDisableBtn(false);
  };
              

  return (
    <div className='main-container' key={dataTree.length}>

      <div className='container-path'>
        <Breadcrumbs 
          timeIsRuning={timeIsRuning}
          parents={parents}
          setParents={setParents}
          singleItem={singleItem}
          setSingleItem={setSingleItem}
        />
      </div>
      {buttonsLoad && (
        <div className='btn-container'>
          <button
              onClick={handleStart1}
              disabled={!timeIsRuning || singleItem === null}
              className={`btn-start ${!timeIsRuning ? "btn-disabled" : ""}`}
          >
            Start
          </button>
          <button
              onClick={handleStop1}
              disabled={timeIsRuning || !isSelectedLeaf()}
              // disabled={timeIsRuning}
              className={`btn-stop ${timeIsRuning ? "btn-disabled" : ""}`}
          >
            Stop
          </button>

            <button
                onClick={handleFinish}
                disabled={initialStartTime == null || !timeIsRuning}
                className={`btn-finish ${!timeIsRuning ? "btn-disabled" : ""}`}
            >
              Finish
            </button>
        </div>
      )}

      <div className='category-container'>
        <div className='item-container'>
          <RenderLeaf 
            items={filteredItems(dataTree, parents)}
            singleItem={singleItem}
            disableBtn={disableBtn}
            handleSelectItem={handleSelectItem}
          />
          {parents.length > 2 && (
            <DeleteLastElementButton 
              setParents={setParents}
              setSingleItem={setSingleItem}
            />
          )}
        </div>
        <div className='second-container'></div>
        <div className='sub-container'></div>
        <div></div>
      </div>

      <div className='container-with-time'>
        {startTime && (
            <div>
              <p>Start: {changeTAndDeleteMilisec(startTime)}</p>
            </div>
        )}

        {endTime && (
            <div>
              <p>Stop: {changeTAndDeleteMilisec(endTime)}</p>
            </div>
        )}

        {initialStartTime && (
            <div>
              <p>Initial Start Time: {changeTAndDeleteMilisec(initialStartTime)}</p>
          </div>
        )}
      </div>
      {buttonsLoad && (
        <CurrentCategry 
        timeIsRuning={timeIsRuning}
        parents={parents}
        setParents={setParents}
        setButtonsLoad={setButtonsLoad}
        setSingleItem={setSingleItem}
        />
      )}
  </div>
    
)};

export default TimeDifferenceCalculator;
