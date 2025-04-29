@echo off
cd /d "%~dp0"
echo Start server...
start "" cmd /k "node server.js"
