import React, { useEffect, useMemo, useState } from 'react';
import "./App.css"
import { changeTAndDeleteMilisec } from './changeTAndDeleteMilisec';
import data from './data.json';
import { produce } from 'immer';
import CurrentCategry from './CurrentCategory';
import { TimeElement, Item } from './Interfaces';
import Breadcrumbs from './Breadcrumb';
import { fetchWithAuth, useDeviceFingerprint } from './auth';
import { findLeadNodes } from './utils/findLeadNodes/leafNodes';
import { RenderLeaf } from "./components/renderLeaf/RenderLeaf"
import { filteredItems } from './utils/helper/filteredItems';
import { DeleteLastElementButton } from './components/backBtn/DeleteLastElementButton';

const TimeDifferenceCalculator: React.FC = () => {
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null);
  const [startTime1, setStartTime1] = useState<Date | null>(null);
  const [endTime1, setEndTime1] = useState<Date | null>(null);
  const [finishTime1, setFinishTime1] = useState<Date | null>(null);
  const [awariaStartTime1, setAwariaStartTime1] = useState<Date | null>(null);
  const [awariaStopTime1Number, setAwariaStopTime1Number] = useState<number>(0);
  const [timeIsRuning, setTimeIsRuning] = useState<boolean>(true);
  const [buttonsLoad, setButtonsLoad] = useState<boolean>(false);
  const [lastStartDate, setLastStartDate] = useState<Date | null>(null);
  const [intervalDates, setIntervalDates] = useState<TimeElement[]>([]);
  const [dataTree, setDataTree] = useState<Item[]>(data);
  const [parents, setParents] = useState<Item[]>([]);
  const [singleItem, setSingleItem] = useState<Item | null>(null);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

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
    // console.log("finish time,", finishTime1);
    if(singleItem?.name === "Awaria") {
      setDisableBtn(false);
      // console.log("awaria start Time1,", awariaStartTime1);
      // console.log("awaria stop Time1,", awariaStopTime1Number);
    }
  }, [parents, dataTree, singleItem, finishTime1, awariaStartTime1, awariaStopTime1Number]);
  
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
      const now = new Date();
      if(!awariaStartTime1) {
        setAwariaStartTime1(now);
      }
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

  // const removeAndLiftItem = (items: Item[], nameToRemove: string): Item[] => {
  //   let count = 0;
  //   const recursiveRemove = (nodes: Item[]): void => {
  //     nodes.forEach((node, index) => {
  //       if (node.name === nameToRemove) {
  //         count++;
  //         nodes.splice(index, 1, ...node.children);
  //       } else {
  //         recursiveRemove(node.children);
  //       }
  //     });
  //   };
  //   const updatedItems = produce(items, (draft) => {
  //     recursiveRemove(draft);
  //   });

  //   setDataTree((prev) => {
  //     const newTree = updatedItems;
  //     setParents((prev) => {
  //       const newP = prev.map((p) => {
  //         const upI = newTree.find((i) => i.name === p.name);
  //         return upI ? upI : p;
  //       })

  //       return newP;
  //     });
  //     return newTree;
  //   })

  //   return updatedItems;
  // };
  
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
    setStartTime1(now);
    setEndTime1(null);
    setTimeIsRuning(!timeIsRuning);
  };

  const handleStop1 = () => {
    const now = new Date();
    setEndTime1(now);
    setAwariaStartTime1(null);
    if(lastStartDate && startTime1) {
      const id: TimeElement = {
        startDate: startTime1,
        endDate: now,
        path: getPath(singleItem, parents),
      };
      setTimeIsRuning(!timeIsRuning);
      setIntervalDates([...intervalDates, id]);
    }

    // if(singleItem?.name === "Prygotowanie") {
    //   setParents((prev) => singleItem ? [...prev, singleItem] : prev);
    //   removeAndLiftItem(dataTree, "Prygotowanie");
    // }    
    // if(singleItem?.name === "Przerwa") {
    //   removeAndLiftItem(dataTree, "Przerwa");
    // }    

    setSingleItem(null);
    setDisableBtn(false);

    if(parents && parents[0]) {
      setParents([parents[0]]);
    }
    if(parents.some(p=> p.name === "Awaria")) {
      if (!awariaStartTime1) {
        console.warn("awaria Start Time1 is not activeted, exit...")
        return;
      };
      const awariaStart = awariaStartTime1;
      console.warn("awaria Started time: ", awariaStart);

      const awariaStopped = new Date();
      console.warn("awaria Stopped time: ", awariaStopped);
      
      const awariaDuration = Math.floor((awariaStopped.getTime() - awariaStart.getTime()) / 1000);
      console.log("🕒 Розрахований час простою через аварію:", awariaDuration, "секунд");

      setAwariaStopTime1Number((prev) => {
        const update = prev + awariaDuration;
        console.log("📊 Оновлений загальний час аварій:", update, "секунд");
        return update;
      });
    }
  };

  const getPath = (item: Item | null, parents: Item[]): string => {
    if(!item) return "";
    const pathArray = [...parents.map((p) => p.name), item.name];
    return pathArray.join(" / ");
  }

  const handleFinish1 = async () => {
    if (!initialStartTime || !endTime1) return;
    
    const now = new Date();
    if(!finishTime1) {
      setFinishTime1(now);
    }
    const firstStartTime = initialStartTime;
    const finalEndTime = endTime1;
    const finishTime = finishTime1 ?? now;
    const timeFromStartTillFinish = Math.floor((finishTime.getTime() - firstStartTime.getTime()) / 1000);
    const totalTime = Math.floor((finalEndTime.getTime() - firstStartTime.getTime()) / 1000);

    const dataToSend = {
      initialStartTime: changeTAndDeleteMilisec(initialStartTime),
      finalEndTime: changeTAndDeleteMilisec(finalEndTime),
      totalTime: totalTime.toFixed(0),
      awariaTime: awariaStopTime1Number.toFixed(0),
      finishTime: changeTAndDeleteMilisec(finishTime),
      timeFromFisrtStartTillFinish: timeFromStartTillFinish.toFixed(0),
      intervals: intervalDates.map(id => {
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
    setStartTime1(null);
    setEndTime1(null);
    setFinishTime1(null);
    setAwariaStartTime1(null);
    setAwariaStopTime1Number(0);
    setTimeIsRuning(true);
    setLastStartDate(null);
    setIntervalDates([]);
    setDataTree(data);
    setParents([]);
    setSingleItem(null);
    setDisableBtn(false);
    setButtonsLoad(false);
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
        {startTime1 && (
            <div>
              <p>Start: {changeTAndDeleteMilisec(startTime1)}</p>
            </div>
        )}

        {endTime1 && (
            <div>
              <p>Stop: {changeTAndDeleteMilisec(endTime1)}</p>
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
