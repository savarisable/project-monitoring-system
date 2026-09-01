@echo off
title Push Project Monitoring System to GitHub
setlocal EnableDelayedExpansion

echo =====================================================================
echo    P. R. Pote Patil College of Engineering & Management, Amravati
echo          UPLOADING TO GITHUB: savarisable/project-monitoring-system
echo =====================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [1/4] Initializing Git...
if not exist ".git" (
    git init
)

echo [2/4] Adding all latest source files...
git add .

echo [3/4] Creating commit...
git commit -m "Production release: Project Monitoring System with Student Diary, Multi-group Selection, Docker, and Cloud Deployment"

echo [4/4] Setting remote and pushing to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/savarisable/project-monitoring-system.git
git branch -M main

git push -u origin main --force

echo.
echo =====================================================================
echo  SUCCESS! Your code is pushed to:
echo  https://github.com/savarisable/project-monitoring-system
echo =====================================================================
echo.
pause
