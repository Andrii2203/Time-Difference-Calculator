require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); 
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'time-difference.txt');

const sendEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOption = {
        from: process.env.EMAIL_USER,
        to: "qqq91166@gmail.com",
        subject: "Time Difference Data",
        text: `that are a new data:\n\n${JSON.stringify(data, null, 2)}`
    };

    try{
        await transporter.sendMail(mailOption);
        console.log("Email sended successful");
    } catch ( error ) {
        console.error("Something went wrong:", error);
    }
}

app.post('/save-time-data', async (req, res) => {
    const data = req.body;

    fs.writeFile(filePath, JSON.stringify(data, null, 2), async (err) => {
        if (err) {
            return res.status(500).send('Błąd przy zapisywaniu danych');
        }

        await sendEmail(data);
        console.log("save data:", req.body); 
        res.send('Dane zostały zapisane na serwerze i wysłane e-mailem!');
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


