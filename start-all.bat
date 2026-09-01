@echo off
title PMS Portal Launcher
echo ===================================================
echo  Starting Project Monitoring System Full Stack...
echo ===================================================
start "Backend" "%~dp0start-backend.bat"
start "Frontend" "%~dp0start-frontend.bat"
echo Started both services in separate windows!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
timeout /t 5
