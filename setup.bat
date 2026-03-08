@echo off
echo ============================================
echo DotaGuess Setup Script
echo ============================================
echo.

echo [1/3] Installing backend dependencies...
cd /d %~dp0backend
call npm install
cd /d %~dp0

echo.
echo [2/3] Downloading hero data from OpenDota API...
node scripts/downloadHeroes.js

echo.
echo [3/3] Installing frontend dependencies...
cd /d %~dp0frontend
call npm install
cd /d %~dp0

echo.
echo ============================================
echo Setup complete! Run start.bat to launch.
echo ============================================
pause
