@echo off
title PMS Frontend (Vite 3000)
echo ===================================================
echo  Starting Project Monitoring System Frontend...
echo  Port: 3000
echo ===================================================
cd /d "%~dp0frontend"
npm run dev
pause
