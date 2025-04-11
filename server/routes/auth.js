const express = require('express');
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken, BLACKLIST_TOKENS, REFRESH_TOKENS } = require("../config/jwt");
const logger = require('../logsFile/logger');
const startLoop = require('../generateFile/generateFile')
// const router = express.Router();

const USER = {
    "admin" : process.env.USER_PASSWORD
};
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(`[${new Date().toISOString()}] Received login request. Username: ${username}`);
    logger.info(`Login attempt for user: ${username} on client IP: ${req.ip} on server`);
    // console.log("Stored token after login:", REFRESH_TOKENS.get(username));
    logger.info(`Stored token after login: ${REFRESH_TOKENS.get(username)}`);
    if (USER[username] && await bcrypt.compare(password, USER[username])) {
        // console.log(`[${new Date().toISOString()}] Credentials are correct for username: ${username}`);
        logger.info(`Credentials are correct for username: ${username}`);
        // startLoop();
        const accessToken = generateAccessToken(username);
        const refreshToken = generateRefreshToken(username);
        // console.log(`[${new Date().toISOString()}] Generated refresh token: ${refreshToken}`);
        // console.log(`[${new Date().toISOString()}] Generated access token: ${accessToken}`);
        logger.info(`Generated refresh token`);
        logger.info(`Generated access token`);
        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        logger.info(`Tokens set in cookies redirecting to main options`);
        // console.log(`[${new Date().toISOString()}] Tokens set in cookies, redirecting to /get-time-data`);
        return res.sendFile(path.join(__dirname, '../views/afterLogin.html'));
    } else {
        logger.info(`Login or password is incorrect for username: ${username}`);
        // console.warn(`[${new Date().toISOString()}] Login or password is incorrect for username: ${username}`);
        return res.status(401).send("Login or password is NOT correct");
    }
});

router.get("/login", (req, res) => {
    const token = req.cookies.accessToken;
    // console.log(`[${new Date().toISOString()}] Access token found in cookies: ${token ? 'Yes' : 'No'}`);
    logger.info(`Access token found in cookies: ${token ? 'Yes' : 'No'}`);
    if(token) {
        logger.info(`Already logged in, redirecting to main options`);
        // console.log(`[${new Date().toISOString()}] Already logged in, redirecting to /get-time-data`);
        return res.sendFile(path.join(__dirname, '../views/afterLogin.html'));
    }
    logger.info(`No access token found, rendering login form`);
    // console.log(`[${new Date().toISOString()}] No access token found, rendering login form`);
    res.send(`
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required /><br><br>
            <input type="password" name="password" placeholder="Password" required /><br><br>
            <button type="submit">Login</button>
        </form>    
    `)
});


router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const fingerprint = req.body.fingerprint;
    logger.info(`Refresh token request received`);
    logger.info(`Received fingerprint from body: ${fingerprint}`);
    // console.log(`[${new Date().toISOString()}] Refresh token request received`);
    // console.log(`[${new Date().toISOString()}] Received fingerprint from body: ${fingerprint}`);
    // console.log(`[${new Date().toISOString()}] Received refresh token from cookies: ${refreshToken}`);

    if(!refreshToken || !fingerprint) {
        logger.info(`Missing refresh token or fingerprint`);
        // console.warn(`[${new Date().toISOString()}] Missing refresh token or fingerprint`);
        return res.status(400).send("missing refresh token or fingerprint");
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if(err) {
            logger.info(`Invalid refresh token: ${err.message}`);
            // console.error(`[${new Date().toISOString()}] Invalid refresh token: ${err.message}`);
            return res.status(403).send("Invalid refresh token");
        }

        const username = decoded.username;
        // console.log(`[${new Date().toISOString()}] Refresh token verified, decoded user: ${username}`);
        logger.info(`Refresh token verified, decoded user: ${username}`);
        const devices = readDevices();
        const userDevices = devices[username] || [];

        const deviceEntry = userDevices.find(device => 
            device.refreshToken === refreshToken && device.fingerprint === fingerprint);

        if(!deviceEntry) {
            logger.info(`Device not authorized: ${fingerprint}`);
            // console.warn(`[${new Date().toISOString()}] Device not authorized: ${fingerprint}`);
            return res.status(403).send("Device not authorized");
        }

        const newAccessToken = generateAccessToken(username);
        // console.log(`[${new Date().toISOString()}] New access token generated: ${newAccessToken}`);
        logger.info(`New access token generated for ${username}`);
        res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, path: "/", sameSite: "lax"});
        // console.log(`[${new Date().toISOString()}] Access token set in cookies`);
        logger.info(`Access token set in cookies`);
        return res.send({ message: "Access token refreshed" });
    })
});
router.get("/logout", (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // console.log(`[${new Date().toISOString()}] Logout request received`);
    logger.info(`Logout request received on server`);
    if (accessToken) {
        logger.info(`Access token found, adding to blacklist`);
        // console.log(`[${new Date().toISOString()}] Access token found, adding to blacklist`);
        BLACKLIST_TOKENS.add(accessToken);
    }

    if (refreshToken) {
        const username = jwt.decode(refreshToken)?.username;
        logger.info(`Refresh token found for username: ${username}, deleting from REFRESH_TOKENS`);
        // console.log(`[${new Date().toISOString()}] Refresh token found for username: ${username}, deleting from REFRESH_TOKENS`);
        REFRESH_TOKENS.delete(username);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // console.log(`[${new Date().toISOString()}] Cookies cleared, user logged out successfully`);
    logger.info(`User logged out successfully on server`);
    return res.send({ message: "Logged out successfully" });
});

module.exports = router;