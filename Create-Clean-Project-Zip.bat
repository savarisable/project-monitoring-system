@echo off
title Create Project ZIP Package
setlocal EnableDelayedExpansion

echo =====================================================================
echo    P. R. Pote Patil College of Engineering & Management, Amravati
echo          PROJECT MONITORING SYSTEM - CLEAN ZIP GENERATOR
echo =====================================================================
echo.
echo Packaging project files for sharing...
echo (Excluding heavy node_modules and target build folders for fast upload)
echo.

set "SOURCE_DIR=%~dp0"
set "OUTPUT_ZIP=%SOURCE_DIR%Project-Monitoring-System.zip"

if exist "%OUTPUT_ZIP%" (
    echo Removing previous ZIP file...
    del "%OUTPUT_ZIP%" 2>nul
)

set "TEMP_EXPORT=%TEMP%\PMS_Share_Export_%RANDOM%"
mkdir "%TEMP_EXPORT%" 2>nul

echo [1/3] Copying source files...
robocopy "%SOURCE_DIR%." "%TEMP_EXPORT%" /E /XD "node_modules" "target" ".git" ".metadata" /XF "*.metadata.json" "*.zip" >nul

echo [2/3] Compressing into Project-Monitoring-System.zip...
powershell -Command "Compress-Archive -Path '%TEMP_EXPORT%\*' -DestinationPath '%OUTPUT_ZIP%' -Force"

echo [3/3] Cleaning temporary files...
rmdir /S /Q "%TEMP_EXPORT%" 2>nul

echo.
echo =====================================================================
echo  SUCCESS! Your clean, ready-to-share ZIP file is created at:
echo.
echo  %OUTPUT_ZIP%
echo =====================================================================
echo.
echo You can now send 'Project-Monitoring-System.zip' to your friends/group!
echo.
pause
