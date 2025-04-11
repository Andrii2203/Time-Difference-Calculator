const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const DEVICES_FILE = path.join(__dirname, "devices.json");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const logger = require('../logsFile/logger');
const app = express();
app.use(cookieParser());
app.use(express.json());



const readDevices = () => {
    try {
        const data = fs.readFileSync(DEVICES_FILE, 'utf8');
        console.log(`[${new Date().toISOString()}] Devices file read successfully`);
        return JSON.parse(data || "{}");
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error reading devices file:`, err);
        return [];
    }
}

const writeDevices = (devices) => {
    try {
        fs.writeFileSync(DEVICES_FILE, JSON.stringify(devices, null, 2));
        console.log(`[${new Date().toISOString()}] Devices saved successfully`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error writing devices file:`, err);
    }
}

router.get("/check-devices", async (req, res) => {
    const { fingerprint } = req.query;
    const refreshToken = req.cookies.refreshToken;

    // console.log(`[${new Date().toISOString()}] Check devices request received`);
    logger.info(`Check devices request received for fingerprint: ${fingerprint}`);
    if(!fingerprint || !refreshToken) {
        logger.info(`Missing data: fingerprint or refresh token`);
        // console.warn(`[${new Date().toISOString()}] Missing data: fingerprint or refresh token`);
        return res.status(400).send("Missing data");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        logger.info(`Refresh token verified for user: ${decoded.username}`);
    } catch (err) {
        logger.info(`Invalid refresh token: ${err.message}`);
        // console.error(`[${new Date().toISOString()}] Invalid refresh token: ${err.message}`);
        return res.status(400).send("Invalid refresh token");
    }

    // console.log(`[${new Date().toISOString()}] Decoded refresh token for username: ${decoded.username}`);
    logger.info(`Decoded refresh token for username: ${decoded.username}`);
    const username = decoded.username;
    const devices = readDevices();

    const userDevices = devices[username] || [];
    // console.log(`[${new Date().toISOString()}] Found ${userDevices.length} devices for user ${username}`);
    logger.info(`Found ${userDevices.length} devices for user ${username}`);
    for(const device of userDevices) {
        const isMatch = await bcrypt.compare(refreshToken, device.refreshToken);
        // console.log(`[${new Date().toISOString()}] Comparing refresh token for device with fingerprint ${device.fingerprint}`);
        logger.info(`Comparing refresh token for device with fingerprint ${device.fingerprint}`);
        if(device.fingerprint === fingerprint && isMatch) {
            // console.log(`[${new Date().toISOString()}] Device verified for username: ${username}`);
            logger.info(`Device verified for username: ${username}`);
            return res.send({ message: "Device verified" });
        }
    }
    logger.info(`Device not found for username: ${username}`);
    // console.warn(`[${new Date().toISOString()}] Device not found for username: ${username}`);
    return res.status(404).send({ message: "Device not found" });
});

router.post("/save-devices", async (req, res) => {
    const { fingerprint } = req.body;
    const refreshToken = req.cookies.refreshToken;
    logger.info(`Save device request received. Fingerprint: ${fingerprint}`);
    // console.log(`[${new Date().toISOString()}] Save device request received. Fingerprint: ${fingerprint}, refreshToken: ${refreshToken ? 'Provided' : 'Not provided'}`);

    if(!fingerprint && !refreshToken) return res.status(400).send("Fingerprint and refreshToken are required");
    
    
    if(!fingerprint || !refreshToken) {
        logger.info(`Missing fingerprint or refreshToken`);
        // console.warn(`[${new Date().toISOString()}] Missing fingerprint or refreshToken`);
        return res.status(400).send("Fingerprint and refreshToken are required");
    }
    
    let decoded;
    try {
        decoded = jwt.decode(refreshToken);
        logger.info(`Decoded refresh token for user: ${decoded.username}`);
    } catch (err) {
        logger.info(`Invalid refresh token: ${err.message}`);
        // console.error(`[${new Date().toISOString()}] Invalid refresh token: ${err.message}`);
        return res.status(400).send("Invalid refresh token");
    }

    // console.log(`[${new Date().toISOString()}] Decoded refresh token for username: ${decoded.username}`);
    logger.info(`Decoded refresh token for username: ${decoded.username}`);
    const username = decoded.username;
    const devices = readDevices();
    
    if(!devices[username]) devices[username] = [];
    // console.log(`[${new Date().toISOString()}] Found ${devices[username].length} devices for user ${username}`);
    logger.info(`Found ${devices[username].length} devices for user ${username}`);
    const exist = devices[username].some(device => device.fingerprint === fingerprint);
    if(exist) {
        logger.info(`Device already exists for username: ${username}, fingerprint: ${fingerprint}`);
        // console.warn(`[${new Date().toISOString()}] Device already exists for username: ${username}, fingerprint: ${fingerprint}`);
        return res.status(200).send({ message: "Device already exists" });
    }

    const hashedToken = await bcrypt.hash(refreshToken, 10);
    // console.log(`[${new Date().toISOString()}] Refresh token hashed for user ${username}`);
    logger.info(`Refresh token hashed for user ${username}`);
    devices[username].push({
        fingerprint, 
        refreshToken: hashedToken,
        createAt: new Date().toISOString()
    });

    logger.info(`Device added for username: ${username}, fingerprint: ${fingerprint}`);
    // console.log(`[${new Date().toISOString()}] Device added for username: ${username}, fingerprint: ${fingerprint}`);
    // console.log(`[${new Date().toISOString()}] Before calling writeDevices`);
    writeDevices(devices);
    // console.log(`[${new Date().toISOString()}] Devices saved successfully`);
    logger.info(`Devices saved successfully`);
    res.send({ message: "Fingerprint added" });
});



module.exports = router;
