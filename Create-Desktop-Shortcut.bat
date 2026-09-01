@echo off
title Create Desktop Shortcut - Project Monitoring System
setlocal EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "TARGET=%SCRIPT_DIR%Launch-Portal.bat"
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\Project Monitoring System.lnk"
set "VBS_FILE=%TEMP%\CreateShortcut.vbs"

echo Creating Desktop shortcut for Project Monitoring System...

(
  echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
  echo sLinkFile = "%SHORTCUT_PATH%"
  echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
  echo oLink.TargetPath = "%TARGET%"
  echo oLink.WorkingDirectory = "%SCRIPT_DIR%"
  echo oLink.Description = "Project Monitoring System - P. R. Pote Patil College"
  echo oLink.IconLocation = "shell32.dll,14"
  echo oLink.Save
) > "%VBS_FILE%"

cscript //nologo "%VBS_FILE%"
del "%VBS_FILE%" 2>nul

echo.
echo ====================================================================
echo  SUCCESS! A shortcut named 'Project Monitoring System' has been
echo  placed directly on your Desktop!
echo.
echo  You can now simply double-click the icon on your Desktop anytime
echo  to automatically start the servers and open the website link!
echo ====================================================================
echo.
pause
