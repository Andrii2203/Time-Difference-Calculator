const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const logger = require('../logsFile/logger');
const { log } = require('winston');

const router = express.Router();

const user = [
    { username: 'user1', passwordHash: bcrypt.hashSync("123", 10), id: 1 },
    { username: 'user2', passwordHash: bcrypt.hashSync("234", 10), id: 2 },
];

const ACCESS_SECRET = "accesssecretkey";
const REFRESH_SECRET = "refreshsecretkey";

router.use(cookieParser());

router.get('/checkAuth', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        logger.warn(`No refresh token provided for user: ${req.ip}`);
        return res.status(401).send("No refresh token provided");
    }

    try {
        const decoded = await jwt.verify(refreshToken, REFRESH_SECRET);
        logger.info(`Refresh token verified for user: ${decoded.username} for client IP: ${req.ip}`);
        res.status(200).send("Authenticated successfully");
    } catch (err) {
        logger.error(`Invalid refresh token: ${err.message} for user: ${req.ip}`);
        console.error("Invalid refresh token:", err);
        return res.status(403).send("Invalid refresh token");
    }
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    logger.info(`Login attempt for user: ${username} on client IP: ${req.ip}`);
    
    const foundUser = user.find(u => u.username === username);
    if (!foundUser) {
        logger.info(`User not found: ${username} for client IP: ${req.ip}`);
        return res.status(401).send("Invalid username or password");
    }

    const match = await bcrypt.compare(password, foundUser.passwordHash);
    if (!match) {
        logger.info(`Password mismatch for user: ${username} for client IP: ${req.ip}`);
        return res.status(401).send("Invalid username or password");
    }

    const accessToken = jwt.sign({ id: foundUser.id }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: foundUser.id }, REFRESH_SECRET, { expiresIn: '7d' });
    logger.info(`Generated access token for user: ${username} for client IP: ${req.ip}`);
    logger.info(`Generated refresh token for user: ${username} for client IP: ${req.ip}`);

    res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
});

router.get('/api/logout', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            logger.info(`Logging out user: ${decoded.username} for client IP: ${req.ip}`);
        } catch {
            logger.warn(`Error logging out user: ${req.ip}`);
        }
    } else {
        logger.warn(`No refresh token found for logout for client IP: ${req.ip}`);
    }
    res.clearCookie('refreshToken');
    res.status(200).send("Logged out successfully");
});
module.exports = router;
