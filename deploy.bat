@echo off
title Wellnessa Deployment Preparation
echo ====================================
echo   Wellnessa Deployment Preparation
echo ====================================
echo.

echo This script will prepare Wellnessa for production deployment
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is available
echo.

echo Step 1: Building production version...
cd client
npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please fix any errors first.
    pause
    exit /b 1
)
cd ..

echo ✅ Production build completed
echo.

echo Step 2: Initializing Git repository...
if not exist ".git" (
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo Step 3: Adding files to Git...
git add .
git status

echo.
echo ====================================
echo   Deployment Preparation Complete!
echo ====================================
echo.
echo Next Steps:
echo 1. Create GitHub repository at: https://github.com/new
echo 2. Run: git remote add origin https://github.com/Anshul-Kanodia/wellnessa.git
echo 3. Run: git commit -m "Initial Wellnessa deployment"
echo 4. Run: git push -u origin main
echo.
echo 5. Deploy Backend to Render (FREE): https://render.com
echo 6. Deploy Frontend to Vercel (FREE): https://vercel.com
echo.
echo See DEPLOYMENT.md for detailed instructions!
echo.
pause
