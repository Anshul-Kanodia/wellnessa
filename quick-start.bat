@echo off
title Wellnessa Platform Launcher
color 0A

echo.
echo ╔══════════════════════════════════════╗
echo ║        Wellnessa Platform            ║
echo ║     Healthcare Assessment System     ║
echo ╚══════════════════════════════════════╝
echo.

echo [STEP 1] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js detected

echo.
echo [STEP 2] Installing root dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)
echo ✅ Root dependencies installed

echo.
echo [STEP 3] Installing client dependencies...
cd client
npm install
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Client dependencies installed

echo.
echo [STEP 4] Setting up environment...
if not exist .env (
    echo PORT=5001> .env
    echo NODE_ENV=development>> .env
    echo JWT_SECRET=wellnessa_jwt_secret_key_2024>> .env
    echo ✅ Environment file created
) else (
    echo ✅ Environment file exists
)

echo.
echo ╔══════════════════════════════════════╗
echo ║            READY TO LAUNCH           ║
echo ╚══════════════════════════════════════╝
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5001
echo.
echo 👤 Demo Accounts:
echo    User:       user1 / password123
echo    Admin:      admin1 / admin123
echo    Super Admin: superadmin / super123
echo.
echo Press any key to start the application...
pause >nul

echo.
echo 🚀 Starting Wellnessa Platform...
echo.
start /B npm run dev

echo.
echo ✅ Application is starting...
echo ✅ Frontend will open at http://localhost:3000
echo ✅ Backend API available at http://localhost:5001
echo.
echo Press Ctrl+C to stop the servers
echo Press any key to exit this window...
pause >nul
