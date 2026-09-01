@echo off
title Project Monitoring System - Master Launcher
setlocal EnableDelayedExpansion

echo =====================================================================
echo    P. R. Pote Patil College of Engineering & Management, Amravati
echo          PROJECT MONITORING SYSTEM - AUTO LAUNCHER & MOBILE
echo =====================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: Find Local IPv4 Address
set "LOCAL_IP=127.0.0.1"
for /f "tokens=4" %%a in ('route print ^| findstr " 0.0.0.0 " ^| findstr /v "Default"') do (
    set "LOCAL_IP=%%a"
)

echo [1/3] Starting Spring Boot Backend Server (Port 8080)...
start "PMS Backend (Port 8080)" cmd /c "cd /d "%PROJECT_DIR%backend" && (if exist mvnw.cmd (call mvnw.cmd spring-boot:run) else (mvn spring-boot:run))"

echo [2/3] Starting Frontend Web Server (Port 3000 on 0.0.0.0)...
start "PMS Frontend (Port 3000)" cmd /c "cd /d "%PROJECT_DIR%frontend" && npm run dev -- --host 0.0.0.0"

echo [3/3] Initializing services and opening browser...
echo.
echo =====================================================================
echo  PC Browser Link:      http://localhost:3000
echo.
echo  MOBILE PHONE LINK:    http://!LOCAL_IP!:3000
echo  (Connect your phone to the same Wi-Fi / Hotspot and open the link above)
echo =====================================================================
echo.

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo System running! Keep this window open.
echo.
pause
