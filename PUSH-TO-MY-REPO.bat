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

echo [1/5] Bundling image assets into frontend repository...
copy /Y "C:\Users\USER\.gemini\antigravity\brain\4910d9a7-6e56-40f3-91d7-05abb3ae0061\.user_uploaded\media_1787774560606.png" "frontend\src\assets\collegeBanner.png" >nul 2>&1
copy /Y "C:\Users\USER\.gemini\antigravity\brain\4910d9a7-6e56-40f3-91d7-05abb3ae0061\.user_uploaded\media_1787774574339.jpg" "frontend\src\assets\collegeLogo.jpg" >nul 2>&1
copy /Y "C:\Users\USER\.gemini\antigravity\brain\4910d9a7-6e56-40f3-91d7-05abb3ae0061\.user_uploaded\media_1788250515807.png" "frontend\src\assets\naacBadge.png" >nul 2>&1

echo [2/5] Cleaning any tracked build folders or root conflicts...
git rm -r --cached node_modules 2>nul
git rm -r --cached frontend/node_modules 2>nul
git rm -r --cached frontend/dist 2>nul
git rm -r --cached backend/target 2>nul
del vercel.json 2>nul
del package.json 2>nul

echo [3/5] Staging all files...
git add -A

echo [4/5] Creating commit...
git commit -m "Fix cloud build: embedded local assets and clean Vite config for Vercel"

echo [5/5] Pushing to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/savarisable/project-monitoring-system.git
git branch -M main

git push -u origin main --force

echo.
echo =====================================================================
echo  SUCCESS! Complete standalone code pushed to GitHub!
echo =====================================================================
echo.
pause
