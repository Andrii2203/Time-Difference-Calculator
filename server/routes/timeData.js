const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
const checkAuth = require('../middleware/authMiddleware');
const logger = require('../logsFile/logger');

const router = express.Router();

let filename;
let filePath;

router.post('/save-time-data', async (req, res) => {
    const data = req.body;
    const date = new Date();
    filename = `data-${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}_${date.getHours()}.${date.getMinutes()}.txt`
    filePath = path.join(__dirname, filename);

    logger.info(`Received data: ${JSON.stringify(data)} from client IP: ${req.ip}`);
    logger.info(`File path: ${filePath}`);
    
    fs.writeFile(filePath, JSON.stringify(data, null, 2), async (err) => {
        if (err) {
            logger.info(`Error writing file: ${err}`);
            return res.status(500).send('Błąd przy zapisywaniu danych')
        };
        logger.info(`Data saved to file: ${filename}`);
        await sendEmail(data);
        res.send('Dane zostały zapisane na serwerze i wysłane e-mailem!');
    });
});

router.get('/get-time-data', checkAuth, (req, res) => {
    if(!filePath) {
        logger.info(`File path is not defined for user: ${req.user.username}`); 
        return res.status(500).send("file path is not defined")
    };
    logger.info(`File path: ${filePath} for user: ${req.user.username}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            logger.info(`Error reading file: ${err}`);
            return res.status(500).send('Błąd przy odczytywaniu pliku')
        };

        res.setHeader('Content-Type', 'text/plain');
        res.send(`Secure data for ${req.user.username}\n\nFile data:\n${data}`); 
    });
    
});

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
        subject: `Time Difference Data ${filename}`,
        text: `\n\n${JSON.stringify(data, null, 2)}`
    };

    try{
        await transporter.sendMail(mailOption);
        console.log("Email sended successful");
        logger.info(`Email sent successfully to ${mailOption.to} with subject: ${mailOption.subject} and name of file: ${filename}`);
    } catch ( error ) {
        logger.info(`Error sending email: ${error}`);
        console.error("Something went wrong:", error);
    }
}

module.exports = sendEmail;

module.exports = router;