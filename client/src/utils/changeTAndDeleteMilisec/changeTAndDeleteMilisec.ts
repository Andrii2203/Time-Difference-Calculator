export const changeTAndDeleteMilisec = (timeMarker : Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = timeMarker.getFullYear();
  const month = pad(timeMarker.getMonth() + 1);
  const day = pad(timeMarker.getDate());

  const hours = pad(timeMarker.getHours());
  const minutes = pad(timeMarker.getMinutes());
  const seconds = pad(timeMarker.getSeconds());

  const formattedDate = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  return formattedDate;
}