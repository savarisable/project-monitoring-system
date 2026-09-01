@echo off
title Project Monitoring System - 1-Click Launcher
setlocal EnableDelayedExpansion

echo =====================================================================
echo    P. R. Pote Patil College of Engineering ^& Management, Amravati
echo          PROJECT MONITORING SYSTEM - 1-CLICK LAUNCHER
echo =====================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: 1. Auto-cleanup any old/hung processes on port 8080 and 3000
echo [1/4] Checking and freeing ports 8080 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: 2. Detect Local Wi-Fi / LAN IP for Mobile Access
set "LOCAL_IP=127.0.0.1"
for /f "tokens=4" %%a in ('route print ^| findstr " 0.0.0.0 " ^| findstr /v "Default"') do (
    set "LOCAL_IP=%%a"
)

:: 3. Launch Backend
echo [2/4] Starting Java Spring Boot Backend (Port 8080)...
start "PMS Backend Service" /min cmd /c "cd /d "%PROJECT_DIR%backend" && (if exist mvnw.cmd (call mvnw.cmd spring-boot:run) else (mvn spring-boot:run))"

:: 4. Launch Frontend
echo [3/4] Starting React Frontend (Port 3000 on 0.0.0.0)...
start "PMS Frontend Service" /min cmd /c "cd /d "%PROJECT_DIR%frontend" && npm run dev -- --host 0.0.0.0"

:: 5. Open Browser
echo [4/4] Opening Portal in your browser...
echo.
echo =====================================================================
echo   LAPTOP / PC LINK:    http://localhost:3000
echo.
echo   MOBILE PHONE LINK:  http://!LOCAL_IP!:3000
echo   (Connect phone to same Wi-Fi / Hotspot and open link above)
echo =====================================================================
echo.
echo   DEMO LOGIN ACCOUNTS:
echo   - Project Head:    projecthead       / Project@123
echo   - Faculty Guide:   guide_jawandhiya  / Guide@123
echo   - Student Leader:  student01         / Student@123
echo =====================================================================
echo.

timeout /t 4 /nobreak >nul
start http://localhost:3000

echo System is running in background.
echo To STOP all services, simply run 'CLICK-TO-STOP.bat' or close the windows.
echo.
pause
