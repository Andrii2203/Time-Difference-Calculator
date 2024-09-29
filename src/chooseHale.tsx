import React, { useEffect, useState } from "react";
import "./choosehale.css";
import { categoryAwaria, CategoryAwaria } from "./Interfaces";
import TimeDifferenceCalculator from "./App";

const ChooseYourL1L2: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<"L1" | "L2" | null>(null);
    const [categories, setCategories] = useState<{ L1Categories: CategoryAwaria[], L2Categories: CategoryAwaria[] }>({ L1Categories: [], L2Categories: [] });

    const handleL1Click = () => {
        setSelectedOption("L1");
    };
    const handleL2Click = () => {
        setSelectedOption("L2");
    };

    const divideCategories = (categories: CategoryAwaria[]) => {
        
        const awariesCategoies = categories.filter(
            (category) =>
                Number.isInteger(category.id) &&
                category.id !== 0 &&
                category.parent === -1 &&
                category.single === 0
        );
        // console.log("awariesCategoies", awariesCategoies);

        const half = Math.ceil(awariesCategoies.length / 2);
        const L1Categories = awariesCategoies.slice(0, half);
        const L2Categories = awariesCategoies.slice(half);

        return {
            L1Categories,
            L2Categories,
        };
    };

    useEffect(() => {
        const divided = divideCategories(categoryAwaria);
        setCategories(divided);
    }, []);

    const filteredCategories = selectedOption === "L1" ? categories.L1Categories : categories.L2Categories;

    return (
        <div className="choose-your-l1-l2">
            {!selectedOption && (
                <div className="button-container">
                    <button className="choose-l1" onClick={handleL1Click}>
                        L1
                    </button>
                    <button className="choose-l2" onClick={handleL2Click}>
                        L2
                    </button>
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
    );
};

export default ChooseYourL1L2;