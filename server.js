const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); 
const app = express();

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'time-difference.txt');

app.post('/save-time-data', (req, res) => {
    const data = req.body;

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Błąd przy zapisywaniu danych');
        }
        res.send('Dane zostały zapisane na serwerze!');
    });
});

app.get('/get-time-data', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Błąd przy odczytywaniu pliku');
        }

        res.setHeader('Content-Type', 'text/plain');
        res.send(data); 
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});


