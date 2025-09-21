@echo off
title Wellnessa Repository Cleanup
echo ====================================
echo   Wellnessa Repository Cleanup
echo ====================================
echo.

echo This script will remove redundant/unused files from the repository
echo.

REM Remove redundant batch scripts (keeping only essential ones)
echo Removing redundant batch scripts...

if exist "admin-fix.bat" del "admin-fix.bat"
if exist "debug-start.bat" del "debug-start.bat"
if exist "fix-npm.bat" del "fix-npm.bat"
if exist "install-npm-manually.bat" del "install-npm-manually.bat"
if exist "powershell-fix.bat" del "powershell-fix.bat"
if exist "quick-fix.bat" del "quick-fix.bat"
if exist "run-without-npm.bat" del "run-without-npm.bat"
if exist "simple-start-fixed.bat" del "simple-start-fixed.bat"
if exist "simple-start-no-bcrypt.bat" del "simple-start-no-bcrypt.bat"
if exist "simple-start.bat" del "simple-start.bat"
if exist "start-app.bat" del "start-app.bat"
if exist "start-dev.bat" del "start-dev.bat"
if exist "user-scope-fix.bat" del "user-scope-fix.bat"
if exist "client\start-client.bat" del "client\start-client.bat"

echo ✅ Removed redundant batch scripts

REM Remove old deployment configs
echo Removing old deployment configurations...
if exist "railway.json" del "railway.json"

echo ✅ Removed Railway configuration (replaced with Render)

REM Remove demo/test files
echo Removing demo/test files...
if exist "demo.html" del "demo.html"
if exist "setup.js" del "setup.js"

echo ✅ Removed demo files

REM Remove documentation files (keeping only essential ones)
echo Removing redundant documentation...
if exist "QUICK_START.md" del "QUICK_START.md"
if exist "SETUP.md" del "SETUP.md"

echo ✅ Removed redundant documentation

echo.
echo ====================================
echo   Repository Cleanup Complete!
echo ====================================
echo.
echo Files Removed:
echo - 14 redundant batch scripts
echo - railway.json (replaced with render.yaml)
echo - demo.html and setup.js
echo - QUICK_START.md and SETUP.md
echo.
echo Files Kept:
echo - quick-start.bat (main startup script)
echo - deploy.bat (deployment preparation)
echo - render.yaml (production deployment)
echo - vercel.json (frontend deployment)
echo - DEPLOYMENT.md (complete deployment guide)
echo - README.md (project documentation)
echo.
echo Repository is now clean and ready for deployment!
echo.
pause
