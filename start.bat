@echo off
echo Starting DotaGuess...

REM Start backend in a new window
start "DotaGuess Backend" cmd /k "cd /d %~dp0backend && npm install && node server.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "DotaGuess Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo Both servers starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window
pause > nul
