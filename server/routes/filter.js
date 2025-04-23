const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const dirPath = path.join(__dirname, "../generateFile/");

router.get('/views', (req, res) => {
    res.sendFile(path.join(__dirname, "../views/filter.html"));
})

router.get("/", (req, res) => {
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.txt'));
    res.json(files);
});

router.get('/:filename', (req, res) => {
    const filePath = path.join(dirPath, req.params.filename);
    if(!fs.existsSync(filePath)) return res.status(404).send("File not found");

    const content = fs.readFileSync(filePath, "utf-8");
    // res.json(JSON.parse(content));
    res.send(content);
})

module.exports = router;