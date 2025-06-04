import React from "react";
import { BreadcrumbsProps } from "../../interfaces/Interfaces";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ timeIsRuning, parents, setParents, singleItem, setSingleItem }) => {
    
    const handleBreadcrumbClick = (index: number) => {
        if(index === 0 && !timeIsRuning) {
          console.log("Click on '1' is blocked due to condition.");
          return;
        }
        setParents((prev) => prev.slice(0, index + 1));
        setSingleItem(null);
    }

    const getBreadcrumbPath = () => {
        const breadcrumb = [...parents];
        if(singleItem && !parents.some(p => p.name === singleItem.name)) {
          breadcrumb.push(singleItem);
        }
        return breadcrumb;
    }
      
    return (
        <div>
            {getBreadcrumbPath().map((item, index) => (
                <span key={index}>
                    {index > 0 && " / "}
                <span
                    onClick={() => handleBreadcrumbClick(index)}
                >
                {item.name}
                </span>
            </span>
        ))}
    </div>
    )
}

export default Breadcrumbs;
