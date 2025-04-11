const jwt = require('jsonwebtoken');
const logger = require('../logsFile/logger');

const BLACKLIST_TOKENS = new Set();
const REFRESH_TOKENS = new Map();

const generateAccessToken = (username) => {
    // console.log("Generating access token for user 6:", username);
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    // console.log("Generated access token 7:", accessToken);
    logger.info(`Generated access token for user: ${username}`);
    return accessToken;
}
const generateRefreshToken = (username) => {
    // console.log("Generating refresh token for user 12:", username);
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, { expiresIn: '365d' });
    
    // console.log("Generated refresh token 14:", refreshToken);
    REFRESH_TOKENS.set(username, refreshToken);
    // console.log("Stored refresh token in map 17:", refreshToken);
    // console.log("Refresh token stored in REFRESH_TOKENS map 17:", username);
    logger.info(`Generated refresh token for user: ${username}`);
    return refreshToken;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    BLACKLIST_TOKENS,
    REFRESH_TOKENS,
};