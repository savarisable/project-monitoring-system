@echo off
title Project Monitoring System - Stop Services
echo =====================================================================
echo    PROJECT MONITORING SYSTEM - STOPPING ALL SERVICES
echo =====================================================================
echo.

echo Freeing Port 8080 (Spring Boot Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Freeing Port 3000 (React Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All services stopped successfully.
timeout /t 2 /nobreak >nul
