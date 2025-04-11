import React from "react";
import { CurrentCategoryProps } from "./Interfaces";


const CurrentCategry: React.FC<CurrentCategoryProps> = ({ timeIsRuning, parents, setParents, setButtonsLoad, setSingleItem }) => (
    <div className='current-categry-text'>
    <p onClick={() => {
      if(!timeIsRuning) {
        console.log("Root is bloked. Resetting path.");
        return;
      }
      console.log("Root clicked. Resetting path.");
      setParents([]);
      setButtonsLoad(false);
      setSingleItem(null);
      }}
      >
      Current: {parents[0]?.name}
    </p>
  </div>
)

export default CurrentCategry;
