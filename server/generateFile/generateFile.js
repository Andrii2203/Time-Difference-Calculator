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

    const pracaDuration = Math.floor(Math.random() * remainingTime);
    const awariaDuration = remainingTime - pracaDuration;

    events.push({
        name: "Praca",
        duration: pracaDuration,
    });

    const randomAwaria = getRandomAwaria();
    if (randomAwaria) {
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

function saveEventsToFile(data, currentDate) {
    const startTime = data.dateAndTime["start time"];
    const filename = `${currentDate}_${startTime}.json`;
    const filePath = path.join(__dirname, filename);

    const content = JSON.stringify(data, null, 2);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File saved:', filePath);
        }
    });
}

function generateAndSave(currentDate) {
    const data = generateDailyFiles(currentDate);
    saveEventsToFile(data, currentDate);
}

function startLoop() {
    let currentDate = new Date();

    for (let i = 0; i < 20; i++) {
        const formattedDate = getFormattedDate(currentDate);
        generateAndSave(formattedDate);

        currentDate.setDate(currentDate.getDate() + 1); 
    }
}

// module.exports = startLoop();