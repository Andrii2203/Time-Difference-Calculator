import React, { useState, useEffect } from "react";
import TimeDifferenceCalculator from "./App";
import "./choosehale.css";
import data from "./data.json";
import { Item } from "./Interfaces";


  const ChooseYourL1L2: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ [key: string]: Item[] }>({});
    
    useEffect(() => {
        const newCategories: { [key: string]: Item[] } = {};
        data.forEach((item) => {
            if(item.name) {
                newCategories[item.name] = item.children || [];
            }
        });
        setCategories(newCategories);
    }, []);
    const filteredCategories = selectedOption ? categories[selectedOption] : [];
        
    return(
        <div className="choose-your-l1-l2">
            {!selectedOption && (
                <div className="button-container">
                    {Object.keys(categories).map((level) => (
                        <button
                            key={level}
                            className="choose-option"
                            onClick={() => setSelectedOption(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            )}
            {selectedOption && (
                <div className={`${selectedOption.toLowerCase()}-container`}>
                    <TimeDifferenceCalculator 
                        filteredCategories={filteredCategories}
                        currentCategry={selectedOption}
                    /> 
                </div>
            )}
        </div>
    )
}
export default ChooseYourL1L2;
