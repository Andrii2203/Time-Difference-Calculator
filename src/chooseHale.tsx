import React, { useState } from "react";
import "./choosehale.css"
import { categoryAwaria, CategoryAwaria } from "./Interfaces";
import TimeDifferenceCalculator from "./App";

const ChooseYourL1L2: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<"L1" | "L2" | null>(null);

    const handleL1Click = () => {
        setSelectedOption("L1");
    }

    const handleL2Click = () => {
        setSelectedOption("L2");
    }

    const divideCategories = ( categories: CategoryAwaria[]) => {
        
        const mainCategoies = categories.filter(
            (category) => Number.isInteger(category.id) && category.id !== 0 && category.parent === -1
        );

        const half = Math.ceil(mainCategoies.length / 2);
        const L1Categories = mainCategoies.slice(0, half);
        const L2Categories = mainCategoies.slice(half);

        const setupCategory = categories.find(category => category.id === 0);
        const pracaCategory = categories.find(category => category.id === 2);
        const awariaCategory = categories.find(category => category.id === 3);
        const przerwaCategory = categories.find(category => category.id === 4);

        const addMissingCategories = (categories: CategoryAwaria[], categoriesToAdd: (CategoryAwaria | undefined)[]) => {
            return categoriesToAdd.filter(Boolean).reduce((acc, category) => {
                if (category && !acc.some(cat => cat.id === category.id)) {
                    acc.unshift(category);
                }
                return acc;
            }, [...categories]);
        };

        const sortById = (categories: CategoryAwaria[]) => {
            return categories.slice().sort((a, b) => a.id - b.id);
        };

        const updatedL1Categories = sortById(addMissingCategories(L1Categories, [pracaCategory, awariaCategory, przerwaCategory]));
        const updatedL2Categories = sortById(addMissingCategories(L2Categories, [pracaCategory, awariaCategory, przerwaCategory]));

        return {
            L1Categories: setupCategory ? [setupCategory, ...updatedL1Categories] : updatedL1Categories,
            L2Categories: setupCategory ? [setupCategory, ...updatedL2Categories] : updatedL2Categories,
        };

    }

    const { L1Categories, L2Categories } = divideCategories(categoryAwaria);

    const filteredCategories = selectedOption === "L1" ? L1Categories : L2Categories;


    return(
        <div className="choose-your-l1-l2">
            {!selectedOption && (
                <div className="button-container">
                    <button className="choose-l1" onClick={handleL1Click}>L1</button>
                    <button className="choose-l2" onClick={handleL2Click}>L2</button>
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