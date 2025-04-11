require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');

const logger = require("./server/logsFile/logger");

const filterRouter = require('./server/routes/filter')
const loginPage = require("./server/routes/loginPage");
const authRoutes = require("./server/routes/auth");
const devicesRoutes = require("./server/routes/devices");
const timeDataRoutes = require("./server/routes/timeData");
const checkAuth = require("./server/middleware/authMiddleware");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
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