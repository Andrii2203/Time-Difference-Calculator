require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logger = require("./server/logsFile/logger");

const filterRouter = require('./server/routes/filter')
const loginPage = require("./server/routes/loginPage");
const authRoutes = require("./server/routes/auth");
const devicesRoutes = require("./server/routes/devices");
const timeDataRoutes = require("./server/routes/timeData");
const checkAuth = require("./server/middleware/authMiddleware");

const app = express();
const PORT = 5000;

let allowedOrigin = ['http://localhost:3000'];

function loadAllowedOrigins() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'allowed-origin.txt'), 'utf8');
        allowedOrigin = data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        // console.log('Allowed Origins updated:', allowedOrigin);
        logger.info('Allowed Origins updated:', allowedOrigin);
    } catch (err) {
        logger.error('Error reading allowed-origin.txt:', err);
        console.error('Error reading allowed-origin.txt:', err);
    }
}
loadAllowedOrigins();

fs.watchFile(path.join(__dirname, 'allowed-origin.txt'), (curr, prev) => {
    // console.log('allowed-origin.txt file changed, reloading...');
    logger.info('allowed-origin.txt file changed, reloading...');
    loadAllowedOrigins();
});
app.use(express.json());

const corsOptions = {
    origin: function (origin, callback) {
        // console.log('Incoming request from origin:', origin);
        logger.info('Incoming request from origin:', origin);
        if (!origin || allowedOrigin.includes(origin)) {
            callback(null, true);
        } else {
            // console.log('Blocked request from origin:', origin);
            logger.info('Blocked request from origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const stream = {
    write: (message) => {
        logger.info(message.trim());
    },
}
app.use(morgan('combined', { stream }));
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use('/filter', filterRouter);
app.use(loginPage);
app.use(authRoutes);
app.use(devicesRoutes);
app.use(timeDataRoutes);
app.use(checkAuth)

app.get("/ping", checkAuth, (req, res) => {
    console.log(`[${new Date().toISOString()}] Ping request received`);
    res.status(200).send("Still alive");
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
});