const fs = require('fs');
const path = require('path');

const categories = [
    {
        name: "Awaria",
        children: Array.from({ length: 10 }, (_, i) => ({
            name: `Subcategory${i + 1}`,
            children: Array.from({ length: 3 }, (_, j) => ({
                name: `Subcategory${i + 1} / Child${j + 1}`
            }))
        }))
    },
];

function generateDailyFiles(currentDate) {
    const events = [];
    const maxDuration = 8 * 60 * 60;
    let remainingTime = maxDuration;

    events.push({
        name: "Prygotowanie",
        duration: 15 * 60,
    });
    remainingTime -= 15 * 60;

    events.push({
        name: "Przerwa",
        duration: 30 * 60,
    });
    remainingTime -= 30 * 60;

    const randomAwaria = getRandomAwaria();
    if (randomAwaria) {
        const maxAwaria = remainingTime - 10800;
        const awariaDuration = maxAwaria > 0 ? Math.floor(Math.random() * maxAwaria) : 0;

        events.push({
            name: `Awaria: ${randomAwaria.name}`,
            duration: awariaDuration,
        });
    }

    const startTime = getRandomStartTime();
    const endTime = calculateEndTime(startTime, maxDuration);

    const dateAndTime = {
        date: currentDate.split('_')[0],
        "start time": startTime,
        "end time": endTime,
    };

    return { events, dateAndTime };
}

function getRandomAwaria() {
    if(Math.random() < 0.3) return null;
    const randomIndex = Math.floor(Math.random() * categories[0].children.length);
    const selectedAwaria = categories[0].children[randomIndex];

    const randomChildIndex = Math.floor(Math.random() * selectedAwaria.children.length);
    return selectedAwaria.children[randomChildIndex];
}

function getFormattedDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function getRandomStartTime() {
    const randomMinutes = Math.floor(Math.random() * 31);
    return `08-${String(randomMinutes).padStart(2, '0')}-00`;
}

function calculateEndTime(startTime, totalDurationInSeconds) {
    const [startHour, startMinute, startSecond] = startTime.split('-').map(Number);
    const totalMinutes = totalDurationInSeconds / 60;
    const endDate = new Date();
    endDate.setHours(startHour, startMinute, startSecond);
    endDate.setMinutes(endDate.getMinutes() + totalMinutes);
    const endHour = String(endDate.getHours()).padStart(2, '0');
    const endMinute = String(endDate.getMinutes()).padStart(2, '0');
    const endSecond = String(endDate.getSeconds()).padStart(2, '0');
    return `${endHour}-${endMinute}-${endSecond}`;
}

function formatDateTime(date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}_${HH}:${mm}:${ss}`;
}
function generateAndSave(currentDate) {
    const { events, dateAndTime } = generateDailyFiles(currentDate);
    const start = new Date(`${dateAndTime.date}T${dateAndTime["start time"].replace(/-/g, ":")}`);
    let currentTime = new Date(start);

    const Intervals = events.map(ev => {
        const startDate = new Date(currentTime);
        currentTime.setSeconds(currentTime.getSeconds() + ev.duration);
        const endDate = new Date(currentTime);

        return {
            startDate: formatDateTime(startDate),
            endDate: formatDateTime(endDate),
            path: `L1 / ${ev.name}`,
        };
    });

    const FirstStart = Intervals[0].startDate;
    const LastStop = Intervals[Intervals.length - 1].endDate;
    const FinishTime = new Date(new Date(FirstStart.replace(/_/g, "T")).getTime() + 1000 * 60 * 60 * 8);

    const timeDiffSeconds = (str1, str2) =>
        (new Date(str2.replace(/_/g, "T")).getTime() - new Date(str1.replace(/_/g, "T")).getTime()) / 1000;

    const IntervalsTime = events.reduce((acc, ev) => acc + ev.duration, 0);
    const TimeFromLastStopMinusFirstStart = timeDiffSeconds(FirstStart, LastStop);
    const FinishMinusFirstStart = timeDiffSeconds(FirstStart, formatDateTime(FinishTime));
    const PracaTimeIsFinishMinusFirstStartMinusIntervalsTime =
        FinishMinusFirstStart - IntervalsTime;

    const AwariaTime = events
        .filter(ev => ev.name.startsWith("Awaria"))
        .reduce((acc, ev) => acc + ev.duration, 0);

    const output = {
        FirstStart,
        LastStop,
        TimeFromLastStopMinusFirstStart: `${TimeFromLastStopMinusFirstStart}`,
        AwariaTime: `${AwariaTime}`,
        FinishTime: formatDateTime(FinishTime),
        FinishMinusFirstStart: `${FinishMinusFirstStart}`,
        PracaTimeIsFinishMinusFirstStartMinusIntervalsTime: `${PracaTimeIsFinishMinusFirstStartMinusIntervalsTime}`,
        IntervalsTime: `${IntervalsTime}`,
        Intervals,
    };
    
    const fileName = `data-${dateAndTime.date.replace(/-/g, ".")}_${dateAndTime["start time"].replace(/-/g, ".")}.txt`;
    const filePath = path.join(__dirname, fileName);
    
    const content = JSON.stringify(output, null, 2);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File saved:', filePath);
        }
    });
}
function startLoop() {
    let currentDate = new Date();

    for (let i = 0; i < 1; i++) {
        const formattedDate = getFormattedDate(currentDate);
        generateAndSave(formattedDate);

        currentDate.setDate(currentDate.getDate() + 1); 
    }
}

module.exports = startLoop();