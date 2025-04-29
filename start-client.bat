@echo off
set PATH="C:\Python312\Scripts\;C:\Python312\;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\ProgramData\chocolatey\bin;C:\Program Files\Git\cmd;C:\Users\Andrii\Downloads\php-8.3.7-nts-Win32-vs16-x64;C:\Users\Andrii\AppData\Local\Microsoft\WindowsApps;C:\Users\Andrii\AppData\Roaming\npm;C:\Users\Andrii\AppData\Local\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe;C:\Users\Andrii\AppData\Roaming\nvm;C:\Program Files\nodejs;C:\Users\Andrii\AppData\Local\Programs\Microsoft VS Code\bin;"
cd /d "%~dp0"
echo Start React client...
start "" cmd /k "npm run start"