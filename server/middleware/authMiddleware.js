const jwt = require("jsonwebtoken");
const { BLACKLIST_TOKENS } = require("../config/jwt");
const logger = require("../logsFile/logger");

const jwtVerifyAsync = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const checkAuth = async (req, res, next) => {
    const token = req.cookies.accessToken;
    logger.info(`Incoming request to ${req.originalUrl}`);
    console.log(`[${new Date().toISOString()}] Incoming request to ${req.originalUrl}`);
    
    if (!token) {
        logger.info(`No access token found in cookies`);
        console.warn(`[${new Date().toISOString()}] No access token found in cookies`);
        return res.redirect("/login");
    }

    try {
        logger.info(`Verifying token: ${token}`);
        console.log(`[${new Date().toISOString()}] Verifying token: ${token}`);
        
        if (!BLACKLIST_TOKENS.has(token)) {
            const decoded = await jwtVerifyAsync(token);
            logger.info(`Token verified successfully for user: ${decoded.username}`);
            console.log(`[${new Date().toISOString()}] Token verified successfully for user: ${decoded.username}`);
            req.user = decoded;
            return next();
        } else {
            logger.info(`Token is blacklisted`);
            console.warn(`[${new Date().toISOString()}] Token is blacklisted`);
            return res.redirect("/login");
        }
    } catch (error) {
        logger.info(`JWT verification failed: ${error.message}`);
        console.error(`[${new Date().toISOString()}] JWT verification failed: ${error.message}`);
        return res.redirect("/login");
    }
};
module.exports = checkAuth;
