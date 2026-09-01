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

echo [1/4] Untracking any uploaded node_modules or build folders...
git rm -r --cached node_modules 2>nul
git rm -r --cached frontend/node_modules 2>nul
git rm -r --cached frontend/dist 2>nul
git rm -r --cached backend/target 2>nul

echo [2/4] Staging updated project files...
git add -A

echo [3/4] Creating new commit...
git commit -m "Fix Vercel build configuration: untracked node_modules and updated scripts"

echo [4/4] Pushing new commit to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/savarisable/project-monitoring-system.git
git branch -M main

git push -u origin main --force

echo.
echo =====================================================================
echo  SUCCESS! New commit pushed to GitHub!
echo =====================================================================
echo.
pause
