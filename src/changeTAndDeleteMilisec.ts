import { hour } from "./hour";

export const changeTAndDeleteMilisec = (timeMarker : Date) => {
    const newTimeMarker = new Date(timeMarker.getTime() + hour * 1000); 
    const isoString = newTimeMarker.toISOString();
    const formattedDate = isoString.slice().slice(0, 10) + '_' + isoString.slice(11, 19);
    return formattedDate;
  }