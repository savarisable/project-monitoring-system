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

echo [1/5] Initializing Git...
if not exist ".git" (
    git init
)

echo [2/5] Cleaning any tracked node_modules...
git rm -r --cached node_modules 2>nul
git rm -r --cached frontend/node_modules 2>nul
git rm -r --cached backend/target 2>nul

echo [3/5] Adding all source files...
git add .

echo [4/5] Creating commit...
git commit -m "Fix Vercel build: updated build scripts and untracked node_modules"

echo [5/5] Pushing fix to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/savarisable/project-monitoring-system.git
git branch -M main

git push -u origin main --force

echo.
echo =====================================================================
echo  SUCCESS! Fix has been pushed to GitHub!
echo =====================================================================
echo.
pause
