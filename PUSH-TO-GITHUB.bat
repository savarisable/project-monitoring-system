@echo off
title Push Project to GitHub for Cloud Deployment
setlocal EnableDelayedExpansion

echo =====================================================================
echo    P. R. Pote Patil College of Engineering & Management, Amravati
echo          PROJECT MONITORING SYSTEM - GITHUB UPLOADER
echo =====================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [1/4] Preparing Git Repository...
if not exist ".git" (
    git init
    git branch -M main
)

echo [2/4] Staging all files...
git add .

echo [3/4] Creating Commit...
git commit -m "Production ready commit: Project Monitoring System with Student Diary, Multi-group Selection, and Cloud Deployment"

echo.
echo =====================================================================
echo  STEP: Connect your GitHub Repository
echo =====================================================================
echo  1. Go to https://github.com/new in your browser.
echo  2. Name your repository (e.g., 'project-monitoring-system').
echo  3. Click 'Create repository'.
echo  4. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/project-monitoring-system.git).
echo =====================================================================
echo.
set /p REPO_URL="Paste your GitHub Repository URL here: "

if "%REPO_URL%"=="" (
    echo.
    echo No URL entered. You can run this file again anytime after creating the repo!
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [4/4] Pushing code to GitHub...
git push -u origin main

echo.
echo =====================================================================
echo  SUCCESS! Your project is now uploaded to GitHub!
echo  Next step: Deploy Frontend on Vercel and Backend on Render in 2 clicks!
echo =====================================================================
echo.
pause
